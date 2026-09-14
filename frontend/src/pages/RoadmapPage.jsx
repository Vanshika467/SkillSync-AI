import { useState } from "react";
import { generateRoadmap } from "../services/roadmapService.js";
import Navbar from "../components/Navbar.jsx";
import WeekCard from "../components/WeekCard.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

function RoadmapPage() {
    const [targetRole, setTargetRole] = useState("");
    const [roadmap, setRoadmap] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setError("");
        setLoading(true);

        try {
            const result = await generateRoadmap(targetRole);
            setRoadmap(result.data.roadmap);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950">
            <Navbar />
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Your Learning Roadmap
                </h1>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {!roadmap && (
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl text-center">
                        <p className="text-gray-400 mb-4">
                            Generate a personalized learning roadmap based on your missing skills.
                        </p>
                        <div className="max-w-sm mx-auto mb-4">
                            <Input
                                type="text"
                                placeholder="Target role (e.g. Android Developer) - optional"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleGenerate} disabled={loading}>
                            {loading ? "Generating... (this may take a moment)" : "Generate Roadmap"}
                        </Button>
                    </div>
                )}

                {roadmap && (
                    <div className="space-y-6">
                        {roadmap.weeks.map((week, index) => (
                            <WeekCard key={index} week={week} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RoadmapPage;