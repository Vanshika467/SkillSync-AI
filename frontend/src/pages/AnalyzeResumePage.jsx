import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { analyzeResume } from "../services/atsService.js";
import Navbar from "../components/Navbar.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";

function AnalyzeResumePage() {
    const { resumeId } = useParams();
    const navigate = useNavigate();

    const [jobDescription, setJobDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!jobDescription.trim()) {
            setError("Please enter a job description");
            return;
        }

        setLoading(true);

        try {
            const result = await analyzeResume(resumeId, jobDescription);
            const analysisId = result.data._id;
            navigate(`/ats-results/${analysisId}`);
        } catch (err) {
            setError(err.response?.data?.message || "Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950">
            <Navbar />
            <div className="flex items-center justify-center p-8 animate-fade-in-up">
                <Card className="w-full max-w-2xl">
                    <h1 className="text-2xl font-bold text-white mb-2 text-center">
                        Analyze your Resume
                    </h1>
                    <p className="text-gray-400 text-sm text-center mb-6">
                        Paste the job description you're targeting
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            placeholder="Paste job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none"
                            required
                        />

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Analyzing..." : "Analyze Resume"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default AnalyzeResumePage;