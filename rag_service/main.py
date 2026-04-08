import os
import logging
import hashlib
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from groq import Groq
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential

load_dotenv()

# ─── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# ─── Config ───────────────────────────────────────────────────────────────────
GROQ_API_KEY    = os.environ.get("GROQ_API_KEY")
RAG_SERVICE_KEY = os.environ.get("RAG_SERVICE_KEY", "rag-secret-key-change-in-prod")
CHROMA_DB_PATH  = os.environ.get("CHROMA_DB_PATH", "./chroma_db")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set in environment variables")

# ─── Global Clients ───────────────────────────────────────────────────────────
groq_client        = None
chroma_collection  = None
embedder           = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global groq_client, chroma_collection, embedder
    logger.info("Starting LMS RAG Service...")

    groq_client = Groq(api_key=GROQ_API_KEY)

    # Persistent ChromaDB — data survives server restarts
    chroma_client = chromadb.PersistentClient(
        path=CHROMA_DB_PATH,
        settings=Settings(anonymized_telemetry=False)
    )
    chroma_collection = chroma_client.get_or_create_collection(
        name="lms_lectures",
        metadata={"hnsw:space": "cosine"}
    )

    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    logger.info("LMS RAG Service ready!")
    yield
    logger.info("LMS RAG Service shutting down...")

# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="LMS RAG Service",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Auth ─────────────────────────────────────────────────────────────────────
api_key_header = APIKeyHeader(name="X-RAG-Key", auto_error=False)

def verify_api_key(key: str = Security(api_key_header)):
    if key != RAG_SERVICE_KEY:
        raise HTTPException(status_code=403, detail="Invalid or missing RAG service key")
    return key

# ─── Models ───────────────────────────────────────────────────────────────────
class IndexTextRequest(BaseModel):
    lecture_id: str
    title: str
    text: str

class TranscribeRequest(BaseModel):
    lecture_id: str
    title: str
    video_url: str

class QuestionRequest(BaseModel):
    lecture_id: str
    question: str
    
class AnnouncementRequest(BaseModel):
    short_note: str
    audience: str = "students"  # students / teachers / all
    
class DoubtRequest(BaseModel):
    lecture_id: str
    doubt: str
    student_name: str = "Student"

# Added by Hanee ✅
class QuizGenerateRequest(BaseModel):
    lecture_id: str
    num_questions: int = 5

# ─── Helpers ──────────────────────────────────────────────────────────────────
def chunk_text(text: str, size: int = 500, overlap: int = 50):
    """Split text into overlapping chunks for better retrieval."""
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start:start + size])
        start += size - overlap
    return chunks

def make_chunk_ids(lecture_id: str, chunks: list):
    return [f"{lecture_id}_{hashlib.md5(c.encode()).hexdigest()[:8]}" for c in chunks]

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def call_groq(messages: list, model: str = "llama-3.3-70b-versatile") -> str:
    res = groq_client.chat.completions.create(
        model=model,
        messages=messages,
        max_tokens=1024,
        temperature=0.3,
    )
    return res.choices[0].message.content

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "service": "LMS RAG Service", "version": "1.0.0"}


@app.post("/index-text", dependencies=[Depends(verify_api_key)])
async def index_text(req: IndexTextRequest):
    """Index lecture text/transcript + generate summary."""
    try:
        logger.info(f"Indexing lecture: {req.lecture_id}")

        # Delete old chunks for this lecture (supports re-indexing)
        existing = chroma_collection.get(where={"lecture_id": req.lecture_id})
        if existing["ids"]:
            chroma_collection.delete(ids=existing["ids"])

        chunks     = chunk_text(req.text)
        ids        = make_chunk_ids(req.lecture_id, chunks)
        embeddings = embedder.encode(chunks, show_progress_bar=False).tolist()
        metadatas  = [{"lecture_id": req.lecture_id, "title": req.title} for _ in chunks]

        chroma_collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids,
            metadatas=metadatas
        )

        summary = call_groq([
            {"role": "system", "content": (
                "You are an educational assistant. Always respond in English only. Summarize the lecture transcript "
                "in 5-7 clear bullet points covering key concepts and learning outcomes."
            )},
            {"role": "user", "content": f"Title: {req.title}\n\nTranscript:\n{req.text[:4000]}"}
        ])

        logger.info(f"Indexed {len(chunks)} chunks for {req.lecture_id}")
        return {"success": True, "lecture_id": req.lecture_id, "chunks_indexed": len(chunks), "summary": summary}

    except Exception as e:
        logger.error(f"Index error [{req.lecture_id}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/transcribe", dependencies=[Depends(verify_api_key)])
async def transcribe(req: TranscribeRequest):
    """Download YouTube audio, transcribe via Groq Whisper, then index."""
    try:
        import yt_dlp, tempfile
        logger.info(f"Transcribing: {req.lecture_id} — {req.video_url}")

        with tempfile.TemporaryDirectory() as tmp:
            ydl_opts = {
                "format": "bestaudio/best",
                "outtmpl": f"{tmp}/audio.%(ext)s",
                "postprocessors": [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3", "preferredquality": "128"}],
                "quiet": True,
                "no_warnings": True,
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.download([req.video_url])

            audio_path = f"{tmp}/audio.mp3"
            if not os.path.exists(audio_path):
                raise FileNotFoundError("Audio extraction failed. Make sure FFmpeg is installed.")

            with open(audio_path, "rb") as f:
                result = groq_client.audio.transcriptions.create(
                    file=("audio.mp3", f),
                    model="whisper-large-v3",
                    response_format="text"
                )

        transcript = result if isinstance(result, str) else result.text
        logger.info(f"Transcribed {len(transcript)} chars for {req.lecture_id}")

        # Auto index the transcript
        index_result = await index_text(IndexTextRequest(
            lecture_id=req.lecture_id,
            title=req.title,
            text=transcript
        ))

        return {
            "success": True,
            "lecture_id": req.lecture_id,
            "transcript": transcript,
            "summary": index_result["summary"],
            "chunks_indexed": index_result["chunks_indexed"]
        }

    except Exception as e:
        logger.error(f"Transcribe error [{req.lecture_id}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ask", dependencies=[Depends(verify_api_key)])
async def ask(req: QuestionRequest):
    """Answer a question from lecture content only (RAG)."""
    try:
        logger.info(f"Q&A [{req.lecture_id}]: {req.question}")

        q_embed = embedder.encode([req.question], show_progress_bar=False).tolist()
        results = chroma_collection.query(
            query_embeddings=q_embed,
            n_results=5,
            where={"lecture_id": req.lecture_id}
        )

        if not results["documents"] or not results["documents"][0]:
            raise HTTPException(status_code=404, detail="Lecture not indexed yet. Please transcribe or index it first.")

        context = "\n\n".join(results["documents"][0])
        answer  = call_groq([
            {"role": "system", "content": (
                "You are an intelligent tutor. Always respond in English only. Answer the student's question based ONLY "
                "on the provided lecture content. If the answer is not in the content, "
                "say: 'This topic was not covered in the lecture.' Be clear and educational."
            )},
            {"role": "user", "content": f"Lecture Content:\n{context}\n\nQuestion: {req.question}"}
        ])

        return {"success": True, "question": req.question, "answer": answer, "lecture_id": req.lecture_id}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Q&A error [{req.lecture_id}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/summary/{lecture_id}", dependencies=[Depends(verify_api_key)])
async def get_summary(lecture_id: str):
    """Get summary of an already-indexed lecture."""
    try:
        results = chroma_collection.get(where={"lecture_id": lecture_id})
        if not results["documents"]:
            raise HTTPException(status_code=404, detail="No content found for this lecture")

        full_text = " ".join(results["documents"])
        title     = results["metadatas"][0].get("title", "Lecture") if results["metadatas"] else "Lecture"

        summary = call_groq([
            {"role": "system", "content": "You are an educational assistant. Always respond in English only. Summarize the lecture in 5-7 bullet points covering key concepts."},
            {"role": "user", "content": f"Title: {title}\n\nContent:\n{full_text[:4000]}"}
        ])

        return {"success": True, "lecture_id": lecture_id, "summary": summary}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Summary error [{lecture_id}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/lecture/{lecture_id}", dependencies=[Depends(verify_api_key)])
async def delete_lecture_index(lecture_id: str):
    """Delete indexed content when lecture is deleted from LMS."""
    try:
        existing = chroma_collection.get(where={"lecture_id": lecture_id})
        if existing["ids"]:
            chroma_collection.delete(ids=existing["ids"])
        return {"success": True, "lecture_id": lecture_id, "deleted_chunks": len(existing["ids"])}
    except Exception as e:
        logger.error(f"Delete error [{lecture_id}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/generate-announcement", dependencies=[Depends(verify_api_key)])
async def generate_announcement(req: AnnouncementRequest):
    """Generate a professional announcement from a short note."""
    try:
        logger.info(f"Generating announcement for: {req.audience}")

        announcement = call_groq([
            {"role": "system", "content": (
                f"You are an assistant for an online Learning Management System. "
                f"Convert the admin's short note into a clear, professional announcement "
                f"for {req.audience}. Keep it concise, friendly and formal. "
                f"Return only the announcement text, nothing else."
            )},
            {"role": "user", "content": f"Short note: {req.short_note}"}
        ])

        return {
            "success": True,
            "announcement": announcement,
            "audience": req.audience
        }

    except Exception as e:
        logger.error(f"Announcement error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auto-answer-doubt", dependencies=[Depends(verify_api_key)])
async def auto_answer_doubt(req: DoubtRequest):
    """Auto answer student doubt using lecture content via RAG."""
    try:
        logger.info(f"Auto answering doubt for lecture {req.lecture_id}")

        q_embed = embedder.encode([req.doubt], show_progress_bar=False).tolist()
        results = chroma_collection.query(
            query_embeddings=q_embed,
            n_results=5,
            where={"lecture_id": req.lecture_id}
        )

        context = "\n\n".join(results["documents"][0]) if results and results["documents"] else ""

        if context:
            answer = call_groq([
                {"role": "system", "content": (
                    "You are a helpful tutor assistant for an online LMS. "
                    "Answer the student's doubt based ONLY on the lecture content provided. "
                    "Be clear, friendly and educational. "
                    "If the answer is not in the lecture content, say: "
                    "'This topic was not covered in the lecture. Please ask your mentor.'"
                )},
                {"role": "user", "content": f"Lecture Content:\n{context}\n\nStudent Doubt: {req.doubt}"}
            ])
            source = "lecture_content"
        else:
            answer = call_groq([
                {"role": "system", "content": (
                    "You are a helpful tutor assistant. "
                    "Answer the student's doubt clearly and educationally. "
                    "Mention that this is a general answer since no specific lecture content was found."
                )},
                {"role": "user", "content": f"Student Doubt: {req.doubt}"}
            ])
            source = "general_knowledge"

        return {
            "success": True,
            "student_name": req.student_name,
            "doubt": req.doubt,
            "answer": answer,
            "answered_from": source,
            "lecture_id": req.lecture_id
        }

    except Exception as e:
        logger.error(f"Doubt auto-answer error [{req.lecture_id}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Added by Abhay ✅
@app.post("/generate-quiz", dependencies=[Depends(verify_api_key)])
async def generate_quiz(req: QuizGenerateRequest):
    """Auto-generate MCQ questions from indexed lecture content using Groq."""
    try:
        logger.info(f"Generating {req.num_questions} quiz questions for lecture: {req.lecture_id}")

        # ── Step 1: Fetch indexed lecture content from ChromaDB ──────────────
        results = chroma_collection.get(where={"lecture_id": req.lecture_id})

        if not results["documents"]:
            raise HTTPException(
                status_code=404,
                detail="Lecture not indexed yet. Please transcribe or index it first."
            )

        # Combine all chunks into one context block (cap at 4000 chars for prompt safety)
        context = "\n\n".join(results["documents"])[:4000]
        title   = results["metadatas"][0].get("title", "Lecture") if results["metadatas"] else "Lecture"

        # ── Step 2: Build prompt and call Groq ───────────────────────────────
        raw_response = call_groq(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert quiz creator for an online Learning Management System. "
                        "Generate multiple-choice questions strictly based on the lecture content provided. "
                        "Each question must have exactly 4 options (A, B, C, D), one correct answer, "
                        "and a short explanation for why that answer is correct. "
                        "Return ONLY a valid JSON array — no markdown, no extra text, no code fences."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Lecture Title: {title}\n\n"
                        f"Lecture Content:\n{context}\n\n"
                        f"Generate exactly {req.num_questions} MCQ questions in this JSON format:\n"
                        "[\n"
                        "  {\n"
                        '    "question": "Question text here?",\n'
                        '    "options": {\n'
                        '      "A": "First option",\n'
                        '      "B": "Second option",\n'
                        '      "C": "Third option",\n'
                        '      "D": "Fourth option"\n'
                        "    },\n"
                        '    "correct_answer": "A",\n'
                        '    "explanation": "Short reason why A is correct."\n'
                        "  }\n"
                        "]"
                    ),
                },
            ],
        )

        # ── Step 3: Parse and validate Groq's JSON response ──────────────────
        # Strip markdown fences in case the model wraps output anyway
        cleaned = raw_response.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()

        try:
            questions = json.loads(cleaned)
        except json.JSONDecodeError:
            logger.error(f"Groq returned invalid JSON for lecture {req.lecture_id}:\n{raw_response}")
            raise HTTPException(
                status_code=502,
                detail="Groq returned malformed JSON. Please try again."
            )

        if not isinstance(questions, list):
            raise HTTPException(status_code=502, detail="Unexpected response structure from Groq.")

        logger.info(f"Generated {len(questions)} questions for lecture: {req.lecture_id}")

        return {
            "success":       True,
            "lecture_id":    req.lecture_id,
            "lecture_title": title,
            "num_questions": len(questions),
            "questions":     questions,
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quiz generation error [{req.lecture_id}]: {e}")
        raise HTTPException(status_code=500, detail=str(e))
