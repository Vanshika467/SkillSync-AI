import { useState } from "react";
import { matchJobs } from "../services/jobService.js";
import Navbar from "../components/Navbar.jsx";
import MatchCard from "../components/MatchCard.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

function JobMatchPage() {
    const [targetRole, setTargetRole] = useState("");
    const [matches, setMatches] = useState([]);
    const [topMissingSkills, setTopMissingSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searched, setSearched] = useState(false);

    const handleMatch = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setSearched(true);

        try {
            const result = await matchJobs(targetRole);
            setMatches(result.data.matches);
            setTopMissingSkills(result.data.topMissingSkills);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load job matches");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950">
            <Navbar />
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Your Job Matches
                </h1>

                <form onSubmit={handleMatch} className="flex gap-4 mb-8">
                    <Input
                        type="text"
                        placeholder="Target role (e.g. Android Developer) - leave empty for all"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Matching..." : "Match Jobs"}
                    </Button>
                </form>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {searched && !loading && matches.length === 0 && !error && (
                    <p className="text-gray-400 text-center">
                        No matches found. Try a different role or upload a resume first.
                    </p>
                )}

                {topMissingSkills.length > 0 && (
                    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl mb-8">
                        <h2 className="text-lg font-bold text-white mb-3">
                            Top Skills to Learn
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {topMissingSkills.map((item, index) => (
                                <span
                                    key={index}
                                    className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm"
                                >
                                    {item.skill} ({item.count} jobs)
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {matches.map((job) => (
                        <MatchCard key={job.jobId} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default JobMatchPage;