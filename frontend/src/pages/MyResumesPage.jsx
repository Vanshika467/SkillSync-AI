import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyResumes } from "../services/resumeService.js";
import Navbar from "../components/Navbar.jsx";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

function MyResumesPage() {
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const result = await getMyResumes();
                setResumes(result.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load resumes");
            } finally {
                setLoading(false);
            }
        };

        fetchResumes();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-xl">Loading your resumes...</p>
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
                    My Resumes
                </h1>

                {resumes.length === 0 && (
                    <p className="text-gray-400 text-center">
                        No resumes uploaded yet. Upload one to get started.
                    </p>
                )}

                <div className="space-y-4">
                    {resumes.map((resume) => (
                        <Card
                            key={resume._id}
                            className="flex justify-between items-center"
                        >
                            <div>
                                <p className="text-white font-semibold">
                                    {resume.fileName || "Resume"}
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/view-resume/${resume._id}`)}
                                >
                                    View
                                </Button>
                                <Button
                                    onClick={() => navigate(`/analyze-resume/${resume._id}`)}
                                >
                                    Analyze
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyResumesPage;