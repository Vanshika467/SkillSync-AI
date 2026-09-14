import { useState, useEffect } from "react";
import { getMyProgress, markItemComplete } from "../services/progressService.js";
import { getMyRoadmap } from "../services/roadmapService.js";
import Navbar from "../components/Navbar.jsx";
import ProgressWeekCard from "../components/ProgressWeekCard.jsx";

function ProgressPage() {
    const [progress, setProgress] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const progressResult = await getMyProgress();
                const roadmapResult = await getMyRoadmap();
                setProgress(progressResult.data);
                setRoadmap(roadmapResult.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load progress");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggle = async (weekNumber, type, itemIndex) => {
        try {
            const result = await markItemComplete(weekNumber, type, itemIndex);
            setProgress(result.data.progress);

            if (result.data.newBadgesEarned && result.data.newBadgesEarned.length > 0) {
                alert(`New badge earned: ${result.data.newBadgesEarned.join(", ")}!`);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update progress");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Loading progress...</p>
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
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Your Progress
                </h1>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl text-center">
                        <p className="text-gray-400 text-sm">Current Streak</p>
                        <p className="text-3xl font-bold text-orange-400">
                            {progress.currentStreak} 🔥
                        </p>
                    </div>
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl text-center">
                        <p className="text-gray-400 text-sm">Longest Streak</p>
                        <p className="text-3xl font-bold text-purple-400">
                            {progress.longestStreak}
                        </p>
                    </div>
                </div>

                {progress.badges.length > 0 && (
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-4 rounded-xl mb-6">
                        <p className="text-gray-400 text-sm mb-2">Badges Earned</p>
                        <div className="flex flex-wrap gap-2">
                            {progress.badges.map((badge, index) => (
                                <span
                                    key={index}
                                    className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm"
                                >
                                    🏆 {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {roadmap.weeks.map((week) => {
                        const weekProgress = progress.weeksProgress.find(
                            (w) => w.weekNumber === week.weekNumber
                        );

                        return (
                            <ProgressWeekCard
                                key={week.weekNumber}
                                week={week}
                                weekProgress={weekProgress}
                                onToggle={handleToggle}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default ProgressPage;