import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getResumeById } from "../services/resumeService.js";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";

function ViewResumePage() {
    const { resumeId } = useParams();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const result = await getResumeById(resumeId);
                setResume(result.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load resume");
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [resumeId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Loading resume...</p>
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
                    {resume.fileName || "Resume"}
                </h1>
                <Card>
                    <p className="text-gray-300 whitespace-pre-wrap">
                        {resume.extractedText}
                    </p>
                </Card>
            </div>
        </div>
    );
}

export default ViewResumePage;