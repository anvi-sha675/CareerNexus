import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Spinner from "../components/common/Spinner";
import { ROLES } from "../utils/constants";

// Public
const Landing = lazy(() => import("../pages/public/Landing"));
const About = lazy(() => import("../pages/public/About"));
const Features = lazy(() => import("../pages/public/Features"));
const Contact = lazy(() => import("../pages/public/Contact"));
const FAQ = lazy(() => import("../pages/public/FAQ"));
const Privacy = lazy(() => import("../pages/public/Privacy"));
const Terms = lazy(() => import("../pages/public/Terms"));
const NotFound = lazy(() => import("../pages/public/NotFound"));
const Forbidden = lazy(() => import("../pages/public/Forbidden"));
const Maintenance = lazy(() => import("../pages/public/Maintenance"));

// Auth
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));

// Student
const StudentDashboard = lazy(
  () => import("../pages/student/StudentDashboard"),
);
const StudentProfile = lazy(() => import("../pages/student/StudentProfile"));
const Skills = lazy(() => import("../pages/student/Skills"));
const Education = lazy(() => import("../pages/student/Education"));
const Experience = lazy(() => import("../pages/student/Experience"));
const Projects = lazy(() => import("../pages/student/Projects"));
const Certifications = lazy(() => import("../pages/student/Certifications"));
const ResumeBuilder = lazy(() => import("../pages/student/ResumeBuilder"));
const ResumeUpload = lazy(() => import("../pages/student/ResumeUpload"));
const ResumeParserResult = lazy(
  () => import("../pages/student/ResumeParserResult"),
);
const Jobs = lazy(() => import("../pages/student/Jobs"));
const JobDetails = lazy(() => import("../pages/student/JobDetails"));
const Applications = lazy(() => import("../pages/student/Applications"));
const ApplicationDetails = lazy(
  () => import("../pages/student/ApplicationDetails"),
);
const SavedJobs = lazy(() => import("../pages/student/SavedJobs"));
const StudentInterviewSchedule = lazy(
  () => import("../pages/student/InterviewSchedule"),
);
const StudentNotifications = lazy(
  () => import("../pages/student/Notifications"),
);

// Recruiter
const RecruiterDashboard = lazy(
  () => import("../pages/recruiter/RecruiterDashboard"),
);
const CreateJob = lazy(() => import("../pages/recruiter/CreateJob"));
const EditJob = lazy(() => import("../pages/recruiter/EditJob"));
const JobManagement = lazy(() => import("../pages/recruiter/JobManagement"));
const Applicants = lazy(() => import("../pages/recruiter/Applicants"));
const ApplicantDetails = lazy(
  () => import("../pages/recruiter/ApplicantDetails"),
);
const CandidateProfile = lazy(
  () => import("../pages/recruiter/CandidateProfile"),
);
const CandidateComparison = lazy(
  () => import("../pages/recruiter/CandidateComparison"),
);
const MatchingDashboard = lazy(
  () => import("../pages/recruiter/MatchingDashboard"),
);
const InterviewSchedule = lazy(
  () => import("../pages/recruiter/InterviewSchedule"),
);
const RecruiterAnalytics = lazy(
  () => import("../pages/recruiter/RecruiterAnalytics"),
);
const CompanyProfile = lazy(() => import("../pages/recruiter/CompanyProfile"));

// Admin
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));
const Recruiters = lazy(() => import("../pages/admin/Recruiters"));
const CompanyVerification = lazy(
  () => import("../pages/admin/CompanyVerification"),
);
const JobModeration = lazy(() => import("../pages/admin/JobModeration"));
const PlatformAnalytics = lazy(
  () => import("../pages/admin/PlatformAnalytics"),
);
const Reports = lazy(() => import("../pages/admin/Reports"));
const SystemSettings = lazy(() => import("../pages/admin/SystemSettings"));
const SystemHealth = lazy(() => import("../pages/admin/SystemHealth"));
const DatabaseStatus = lazy(() => import("../pages/admin/DatabaseStatus"));
const FeedbackManagement = lazy(
  () => import("../pages/admin/FeedbackManagement"),
);

// Shared
const Settings = lazy(() => import("../pages/shared/Settings"));
const Messages = lazy(() => import("../pages/shared/Messages"));

function SuspenseWrap({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <SuspenseWrap>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/403" element={<Forbidden />} />
        </Route>

        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Jobs />} />
        </Route>
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobDetails />} />
        </Route>

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* Student */}
        <Route
          path="/student"
          element={
            <ProtectedRoute roles={[ROLES.STUDENT]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="skills" element={<Skills />} />
          <Route path="education" element={<Education />} />
          <Route path="experience" element={<Experience />} />
          <Route path="projects" element={<Projects />} />
          <Route path="certifications" element={<Certifications />} />
          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="resume-upload" element={<ResumeUpload />} />
          <Route path="resume-parser-result" element={<ResumeParserResult />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetails />} />
          <Route path="saved-jobs" element={<SavedJobs />} />
          <Route
            path="interview-schedule"
            element={<StudentInterviewSchedule />}
          />
          <Route path="notifications" element={<StudentNotifications />} />
        </Route>

        {/* Recruiter */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute roles={[ROLES.RECRUITER]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="company-profile" element={<CompanyProfile />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="edit-job/:id" element={<EditJob />} />
          <Route path="job-management" element={<JobManagement />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="applicants/:id" element={<ApplicantDetails />} />
          <Route path="candidates/:id" element={<CandidateProfile />} />
          <Route
            path="candidate-comparison"
            element={<CandidateComparison />}
          />
          <Route path="matching-dashboard" element={<MatchingDashboard />} />
          <Route path="interview-schedule" element={<InterviewSchedule />} />
          <Route path="analytics" element={<RecruiterAnalytics />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="recruiters" element={<Recruiters />} />
          <Route
            path="company-verification"
            element={<CompanyVerification />}
          />
          <Route path="job-moderation" element={<JobModeration />} />
          <Route path="platform-analytics" element={<PlatformAnalytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="system-settings" element={<SystemSettings />} />
          <Route path="system-health" element={<SystemHealth />} />
          <Route path="database-status" element={<DatabaseStatus />} />
          <Route path="feedback" element={<FeedbackManagement />} />
        </Route>

        {/* Shared authenticated */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
        </Route>

        <Route path="*" element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </SuspenseWrap>
  );
}
