// src/components/WeekCard.jsx
import useScrollAnimation from "../hooks/useScrollAnimation.js";

function WeekCard({ week }) {
    const [ref, isVisible] = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
            <h2 className="text-lg font-bold text-purple-400 mb-2">
                Week {week.weekNumber}: {week.focusSkill}
            </h2>
            <p className="text-gray-300 text-sm mb-4">{week.description}</p>

            <div className="mb-3">
                <p className="text-gray-400 text-sm font-semibold mb-1">Resources:</p>
                <ul className="list-disc list-inside space-y-1">
                    {week.resources.map((resource, i) => (
                        <li key={i} className="text-sm">
                            
                              <a  href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-400 hover:underline"
                            >
                                {resource.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-3">
                <p className="text-gray-400 text-sm font-semibold mb-1">Practice Project:</p>
                <p className="text-gray-300 text-sm">{week.practiceProject}</p>
            </div>

            <div>
                <p className="text-gray-400 text-sm font-semibold mb-1">LeetCode Topics:</p>
                <div className="flex flex-wrap gap-2">
                    {week.leetcodeTopics.map((topic, i) => (
                        <span
                            key={i}
                            className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                        >
                            {topic}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WeekCard;