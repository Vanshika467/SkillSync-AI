import { useState, useEffect } from "react";
import { getPlatformStats, getMissingSkillsTrend } from "../services/adminService.js";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";

function AdminDashboardPage() {
    const [stats, setStats] = useState(null);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const statsResult = await getPlatformStats();
                const trendResult = await getMissingSkillsTrend();
                setStats(statsResult.data);
                setTrend(trendResult.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load admin data. You may not have access.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Loading admin dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-red-400 text-xl">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950">
            <Navbar />
            <div className="max-w-3xl mx-auto p-8 animate-fade-in-up">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Admin Dashboard
                </h1>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    <Card className="text-center">
                        <p className="text-gray-400 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-purple-400">
                            {stats.totalUsers}
                        </p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-gray-400 text-sm">Resumes Analyzed</p>
                        <p className="text-3xl font-bold text-purple-400">
                            {stats.totalResumesAnalyzed}
                        </p>
                    </Card>
                    <Card className="text-center">
                        <p className="text-gray-400 text-sm">Avg ATS Score</p>
                        <p className="text-3xl font-bold text-purple-400">
                            {stats.averageATSScore}
                        </p>
                    </Card>
                </div>

                <Card>
                    <h2 className="text-lg font-bold text-white mb-4">
                        Top Missing Skills (Platform-wide)
                    </h2>
                    <div className="space-y-2">
                        {trend.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-300">{item.skill}</span>
                                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                                    {item.count} users
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default AdminDashboardPage;