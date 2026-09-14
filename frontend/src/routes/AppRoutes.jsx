import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ResumeUploadPage from "../pages/ResumeUploadPage.jsx";
import AnalyzeResumePage from "../pages/AnalyzeResumePage.jsx";
import ATSResultsPage from "../pages/ATSResultsPage.jsx";
import JobSearchPage from "../pages/JobSearchPage.jsx";
import JobMatchPage from "../pages/JobMatchPage.jsx";
import RoadmapPage from "../pages/RoadmapPage.jsx";
import ProgressPage from "../pages/ProgressPage.jsx";
import AdminDashboardPage from "../pages/AdminDashboardPage.jsx";
import MyResumesPage from "../pages/MyResumesPage.jsx";
import ViewResumePage from "../pages/ViewResumePage.jsx";
function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
    {/* by default login page pe bhejdo  */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                 <Route
                    path="/resume-upload"
                    element={
                        <ProtectedRoute>
                            <ResumeUploadPage />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/analyze-resume/:resumeId"
    element={
        <ProtectedRoute>
            <AnalyzeResumePage />
        </ProtectedRoute>
    }
/>

<Route
    path="/ats-results/:analysisId"
    element={
        <ProtectedRoute>
            <ATSResultsPage />
        </ProtectedRoute>
    }
/>
<Route
    path="/job-search"
    element={
        <ProtectedRoute>
            <JobSearchPage />
        </ProtectedRoute>
    }
/>
<Route
    path="/job-match"
    element={
        <ProtectedRoute>
            <JobMatchPage />
        </ProtectedRoute>
    }
/>
<Route
    path="/roadmap"
    element={
        <ProtectedRoute>
            <RoadmapPage />
        </ProtectedRoute>
    }
/>
<Route
    path="/progress"
    element={
        <ProtectedRoute>
            <ProgressPage />
        </ProtectedRoute>
    }
/>
<Route
    path="/admin"
    element={
        <ProtectedRoute>
            <AdminDashboardPage />
        </ProtectedRoute>
    }
/>
<Route
    path="/my-resumes"
    element={
        <ProtectedRoute>
            <MyResumesPage />
        </ProtectedRoute>
    }
/>
<Route
    path="/view-resume/:resumeId"
    element={
        <ProtectedRoute>
            <ViewResumePage />
        </ProtectedRoute>
    }
/>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;