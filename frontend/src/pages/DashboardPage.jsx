import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";

function DashboardPage() {
    const { user } = useAuth();

    const features = [
        {
            title: "Upload Resume",
            description: "Upload a new resume to get started",
            path: "/resume-upload",
            icon: "📄",
            color: "from-blue-500/20 to-blue-600/20 text-blue-400",
        },
        {
            title: "My Resumes",
            description: "View and analyze your uploaded resumes",
            path: "/my-resumes",
            icon: "🗂️",
            color: "from-amber-500/20 to-amber-600/20 text-amber-400",
        },
        {
            title: "Job Search",
            description: "Find real job listings that match your role",
            path: "/job-search",
            icon: "🔍",
            color: "from-cyan-500/20 to-cyan-600/20 text-cyan-400",
        },
        {
            title: "Job Matches",
            description: "See how well your resume matches available jobs",
            path: "/job-match",
            icon: "🎯",
            color: "from-red-500/20 to-red-600/20 text-red-400",
        },
        {
            title: "Learning Roadmap",
            description: "Get an AI-generated roadmap for missing skills",
            path: "/roadmap",
            icon: "🗺️",
            color: "from-emerald-500/20 to-emerald-600/20 text-emerald-400",
        },
        {
            title: "Progress Tracker",
            description: "Track your learning streaks and badges",
            path: "/progress",
            icon: "🔥",
            color: "from-orange-500/20 to-orange-600/20 text-orange-400",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950">
            <Navbar />
            <div className="max-w-7xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-white mb-1">
                    Welcome, {user?.fullName} 👋
                </h1>
                <p className="text-gray-400 mb-8">
                    Here's what you can do with SkillSync AI
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Link key={feature.path} to={feature.path} className="group">
                            <Card
                                className="h-full min-h-[220px] cursor-pointer hover:-translate-y-1 animate-fade-in-up flex flex-col"
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div
                                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-5`}
                                >
                                    {feature.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                                    {feature.title}
                                    <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        →
                                    </span>
                                </h2>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;