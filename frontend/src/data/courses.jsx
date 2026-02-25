import { Code, BarChart, Brain, Megaphone, Database, Globe, Palette } from "lucide-react";
import React from "react";

export const allCourses = [
  {
    id: 1,
    icon: <Code className="w-6 h-6" />,
    title: "Data Science & AI",
    category: "Data Science",
    duration: "6 Months",
    students: "2,500+",
    price: "₹60,000",
    rating: "4.8",
    level: "Intermediate to Advanced",
    modules: 12,
    description: "Master Python, Machine Learning, Deep Learning, and AI with industry projects.",
    features: ["Python Programming", "ML Algorithms", "Deep Learning", "NLP & Computer Vision", "Capstone Projects"]
  },
  {
    id: 2,
    icon: <BarChart className="w-6 h-6" />,
    title: "Data Analytics",
    category: "Analytics",
    duration: "4 Months",
    students: "1,800+",
    price: "₹25,000",
    rating: "4.7",
    level: "Beginner to Intermediate",
    modules: 10,
    popular: true,
    description: "Learn SQL, Excel, Power BI, and Tableau for business intelligence and analytics.",
    features: ["SQL & Databases", "Advanced Excel", "Power BI", "Tableau", "Business Analytics"]
  },
  {
    id: 3,
    icon: <Brain className="w-6 h-6" />,
    title: "Agentic AI",
    category: "AI & ML",
    duration: "3 Months",
    students: "950+",
    price: "₹35,000",
    rating: "4.9",
    level: "Advanced",
    modules: 8,
    description: "Build autonomous AI agents using LangChain, AutoGen, and modern AI frameworks.",
    features: ["LLM Fundamentals", "LangChain", "AutoGen", "AI Agents", "Production Deployment"]
  }

];