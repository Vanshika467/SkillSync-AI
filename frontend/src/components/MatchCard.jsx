// src/components/MatchCard.jsx
import useScrollAnimation from "../hooks/useScrollAnimation.js";

function MatchCard({ job }) {
    const [ref, isVisible] = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-5 rounded-xl transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <p className="text-gray-400 text-sm">
                        {job.company} • {job.location}
                    </p>
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {job.skillMatchPercentage}% match
                </span>
            </div>

            <div className="mt-3">
                <p className="text-green-400 text-sm mb-1">
                    Matched: {job.matchedSkills.join(", ") || "None"}
                </p>
                <p className="text-red-400 text-sm">
                    Missing: {job.missingSkills.join(", ") || "None"}
                </p>
            </div>

            <a
                href={job.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-purple-400 hover:underline text-sm"
            >
                View Job
            </a>
        </div>
    );
}

export default MatchCard;