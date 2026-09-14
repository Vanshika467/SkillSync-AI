import { useState } from "react";
import { searchJobs } from "../services/jobService.js";
import Navbar from "../components/Navbar.jsx";
import JobCard from "../components/JobCard.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

function JobSearchPage() {
    const [role, setRole] = useState("");
    const [location, setLocation] = useState("");
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setSearched(true);

        try {
            const result = await searchJobs(role, location);
            setJobs(result.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to search jobs. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-purple-950">
            <Navbar />
            <div className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold text-white mb-6">
                    Search Jobs
                </h1>

                <form onSubmit={handleSearch} className="flex gap-4 mb-8">
                    <Input
                        type="text"
                        placeholder="Job role (e.g. React Developer)"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                    <Input
                        type="text"
                        placeholder="Location (e.g. Delhi)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? "Searching..." : "Search"}
                    </Button>
                </form>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {searched && !loading && jobs.length === 0 && !error && (
                    <p className="text-gray-400 text-center">
                        No jobs found. Try a different search.
                    </p>
                )}

                <div className="space-y-4">
                    {jobs.map((job) => (
                        <JobCard key={job._id} job={job} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default JobSearchPage;