import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/resumeService.js";
import Navbar from "../components/Navbar.jsx";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";

function ResumeUploadPage() {
    const navigate = useNavigate();

    const [resumeFile, setResumeFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!resumeFile) {
            setError("Please select a resume file");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append("resume", resumeFile);

            const result = await uploadResume(data);
            const resumeId = result.data._id;
            navigate(`/analyze-resume/${resumeId}`);
        } catch (err) {
            setError(err.response?.data?.message || "Upload failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950">
            <Navbar />
            <div className="flex items-center justify-center p-8 animate-fade-in-up">
                <Card className="w-full max-w-md">
                    <h1 className="text-2xl font-bold text-white mb-2 text-center">
                        Upload your Resume
                    </h1>
                    <p className="text-gray-400 text-sm text-center mb-6">
                        We'll analyze it and give you an ATS score
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">
                                Resume (PDF or DOCX)
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                                className="w-full text-gray-300 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white file:text-sm hover:file:bg-purple-500"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Uploading..." : "Upload Resume"}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}

export default ResumeUploadPage;