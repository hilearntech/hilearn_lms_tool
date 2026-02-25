import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Landing pages
import LoginLanding from "./pages/HomePage";
import AllCourses from "./pages/AllCourses";
import AboutUs from "./pages/AboutUs";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForogotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import RegisterLanding from "./pages/auth/RegisterPage";
import VerifyOtp from "./pages/auth/VerifyOtp";

// Admin Pages
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import AdminLayout from "./pages/dashboard/admin/AdminLayout";
import StudentList from "./pages/dashboard/admin/students/StudentList";
import CourseList from "./pages/dashboard/admin/courses/CourseList";
import AddEditCourses from "./pages/dashboard/admin/courses/AddEditCourse";
import LectureList from "./pages/dashboard/admin/lectures/LectureList";
import BatchList from "./pages/dashboard/admin/batches/BatchList";
import AddEditStudent from "./pages/dashboard/admin/students/AddEditStudent";
import StudentDetails from "./pages/dashboard/admin/students/StudentDetails";
import LectureMaterialList from "./pages/dashboard/admin/materials/LectureMaterialList";
import FacultyList from "./pages/dashboard/admin/FacultyList";
import Subscription from "./pages/dashboard/Subscription";
import AdminSubscriptionPlans from "./pages/dashboard/admin/AdminSubscriptionPlans";
import ManageAttendance from "./pages/dashboard/admin/ManageAttendance"; 
import EnquiryList from "./pages/dashboard/admin/Enquiry/EnquiryList";
import AdminAssignments from "./pages/dashboard/admin/assignments/AdminAssignments";
import ReportManagement from "./pages/dashboard/admin/Report/ReportManagement";

// Mentor pages 
import MentorDashboard from "./pages/dashboard/mentor/MentorDashboard";
import MentorDoubt from "./pages/dashboard/mentor/MentorDoubt";
import MentorLayout from "./pages/dashboard/mentor/MentorLayout"; 

// Student pages
import StudentDashboard from "./pages/dashboard/student/StudentDashboard";
import StudentLayout from "./pages/dashboard/student/StudentLayout";
import ProfilePage from "./pages/dashboard/student/ProfilePage";
import QuizzesPage from "./pages/dashboard/student/QuizzesPage";
import LeaderboardPage from "./pages/dashboard/student/LeaderboardPage";
import MyLectures from "./pages/dashboard/student/MyLectures";
import Schedule from "./pages/dashboard/student/Schedule";
import LecturesPage from "./pages/dashboard/student/LecturesPage";
import AttendancePage from "./pages/dashboard/student/AttendancePage";
import ExploreCourses from "./pages/dashboard/student/ExploreCourses";
import MyCourses from "./pages/dashboard/student/MyCourses";
import AddQuiz from "./pages/dashboard/admin/quiz/AddQuiz";
import MentorLectures from "./pages/dashboard/mentor/MentorLectures";
import MentorSchedule from "./pages/dashboard/mentor/MentorSchedule";
import AddMentorQuize from "./pages/dashboard/mentor/AddMentorQuize";
import StudentAssignments from "./pages/dashboard/student/StudentAssignments";
import StudentPerformance from "./pages/dashboard/mentor/StudentPerformance";
import MentorAttendance from "./pages/dashboard/mentor/MentorAttendance";
import AssignmentManager from "./pages/dashboard/mentor/AssignmentManager";
import SuperAdminDashboard from "./pages/dashboard/superadmin/SuperAdminDashboard";
import SuperAdminLayout from "./pages/dashboard/superadmin/SuperAdminLayout";
import CourseDetails from "./pages/CourseDetails";
import AdminList from "./pages/dashboard/superadmin/AdminList";
import SuperAdminStudentManager from "./pages/dashboard/superadmin/SuperAdminStudentManager";
import RevenueDashboard from "./pages/dashboard/superadmin/RevenueDashboard";
import MarketingCMS from "./pages/dashboard/superadmin/MarketingCMS";
import SystemAnalytics from "./pages/dashboard/superadmin/SystemAnalytics";
import MentorBatches from "./pages/dashboard/mentor/MentorBatches";
import MentorCourses from "./pages/dashboard/mentor/MentorCourses";
import StudentProfile from "./pages/dashboard/student/StudentProfile";
import AdminAnnouncements from "./pages/dashboard/admin/announcement/AdminAnnouncements";
import StudentDoubt from "./pages/dashboard/student/StudentDoubt";
import CertificateManager from "./pages/dashboard/admin/certificate/CertificateManager";
import MentorMyProfile from "./pages/dashboard/mentor/MentorMyProfile";
import MentorProfile from "./pages/dashboard/mentor/MentorProfile";
import DemoRequest from "./pages/DemoRequest";

/**
 * @desc Main Application component for routing and navigation
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<LoginLanding />} />
        <Route path="/courses" element={<AllCourses />} />
      
        <Route path="/course/:id" element={<CourseDetails/>}/>
        <Route path="/demo-request/:id" element={<DemoRequest />} />

        <Route path="/about" element={<AboutUs />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterLanding />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* SUBSCRIPTION PAGE */}
        <Route
          path="/subscribe"
          element={<Subscription />}
        />

        <Route path="/superadmin" element={<SuperAdminLayout/>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<SuperAdminDashboard/>}/>
            <Route path="courses" element={<CourseList />} />
            <Route path="courses/add" element={<AddEditCourses />} />
            <Route path="courses/edit/:id" element={<AddEditCourses />} />
            <Route path="faculties" element={<FacultyList />} />
            <Route path="admins" element={<AdminList />} />

            <Route path="students" element={<SuperAdminStudentManager />} />
            <Route path="revenue" element={<RevenueDashboard />} />
            <Route path="cms" element={<MarketingCMS />} />
            <Route path="analytics" element={<SystemAnalytics/>} />
        </Route>

        {/* --- STUDENT PANEL ROUTES --- */}
        <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<AttendancePage />} />
            <Route path="my-profile" element={<ProfilePage />} />
            <Route path="profile" element={<StudentProfile/>}/>
            <Route path="quizzes" element={<QuizzesPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="explore-courses" element={<ExploreCourses />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="lectures" element={<MyLectures />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="/student/doubts" element={<StudentDoubt />} />
        </Route>

        {/* --- MENTOR PANEL ROUTES (NEW) --- */}
        <Route path="/mentor" element={<MentorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MentorDashboard />} />
            <Route path="courses" element={<MentorCourses />} />
            <Route path="attendance" element={<MentorAttendance />} />
             <Route path="lectures" element={<MentorLectures />} /> 
            <Route path="schedule" element={<MentorSchedule />} /> 
            <Route path="quizzes" element={<AddMentorQuize />} /> 
            <Route path="performance" element={<StudentPerformance />} />
            <Route path="batches" element={<MentorBatches/>}/>
            <Route path="assignments" element={<AssignmentManager />} />
            <Route path="myprofile" element={<MentorMyProfile />} />
            <Route path="doubts" element={<MentorDoubt />} />
            <Route path="profile" element={<MentorProfile/>}/>
        </Route>

        {/* --- ADMIN DASHBOARD ROUTES --- */}
        <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            
            <Route path="attendance" element={<ManageAttendance />} />
            <Route path="/admin/certificates" element={<CertificateManager />} />
            <Route path="quizzes" element={<AddQuiz />} />
            <Route path="enquiries" element={<EnquiryList />} />
           <Route path="students" element={<StudentList />} />
            <Route path="students/add" element={<AddEditStudent />} />
            <Route path="students/edit/:id" element={<AddEditStudent />} />
            <Route path="students/:id" element={<StudentDetails />} />
            
            {/* Admin - Resource Management */}
            <Route path="faculties" element={<FacultyList />} />
            <Route path="courses" element={<CourseList />} />
            <Route path="courses/add" element={<AddEditCourses />} />
            <Route path="courses/edit/:id" element={<AddEditCourses />} />
            <Route path="lectures" element={<LectureList />} />
            <Route path="batches" element={<BatchList />} />
          <Route path="students" element={<StudentList />} />
            <Route path="assignments" element={<AdminAssignments />} />
            <Route path="/admin/reports" element={<ReportManagement />} />
          <Route path="subscriptions" element={<AdminSubscriptionPlans />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          

          {/* Student Management */}
          <Route path="students" element={<StudentList />} />
           <Route path="students/edit/:id" element={<AddEditStudent />} />

          {/* Course Management */}
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/add" element={<AddEditCourses />} />
          <Route path="courses/edit/:id" element={<AddEditCourses />} />

          {/* Lecture Management */}
          <Route path="lectures" element={<LectureList />} />

          {/* Batch Management */}
          <Route path="batches" element={<BatchList />} />

          {/* Lecture Material Management */}
          <Route path="materials" element={<LectureMaterialList />} />
            <Route path="materials" element={<LectureMaterialList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;