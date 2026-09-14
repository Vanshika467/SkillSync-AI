import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getAnalysisById } from "../services/atsService.js";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";

function ATSResultsPage() {
    const { analysisId } = useParams();

    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const result = await getAnalysisById(analysisId);
                setAnalysis(result.data);
            } catch (err) {
                setError("Failed to load analysis");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [analysisId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Loading analysis...</p>
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
                    Your ATS Analysis Results
                </h1>

                <Card className="mb-6 text-center">
                    <p className="text-gray-400 text-sm mb-2">ATS Score</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {analysis.atsScore}/100
                    </p>
                </Card>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Card>
                        <p className="text-gray-400 text-sm">Section Score</p>
                        <p className="text-xl text-white">{analysis.sectionScore}</p>
                    </Card>
                    <Card>
                        <p className="text-gray-400 text-sm">Contact Score</p>
                        <p className="text-xl text-white">{analysis.contactScore}</p>
                    </Card>
                    <Card>
                        <p className="text-gray-400 text-sm">Content Score</p>
                        <p className="text-xl text-white">{analysis.contentScore}</p>
                    </Card>
                    <Card>
                        <p className="text-gray-400 text-sm">Keyword Score</p>
                        <p className="text-xl text-white">{analysis.keywordScore}</p>
                    </Card>
                </div>

                <Card className="mb-6">
                    <h2 className="text-lg font-bold text-green-400 mb-3">
                        Matched Skills ({analysis.matchedSkills.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {analysis.matchedSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </Card>

                <Card className="mb-6">
                    <h2 className="text-lg font-bold text-red-400 mb-3">
                        Missing Skills ({analysis.missingSkills.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {analysis.missingSkills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-bold text-white mb-3">Suggestions</h2>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                        {analysis.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

export default ATSResultsPage;