import useScrollAnimation from "../hooks/useScrollAnimation.js";

function ProgressWeekCard({ week, weekProgress, onToggle }) {
    const [ref, isVisible] = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 p-6 rounded-xl transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
            <h2 className="text-lg font-bold text-purple-400 mb-3">
                Week {week.weekNumber}: {week.focusSkill}
            </h2>

            <div className="space-y-2 mb-3">
                {week.resources.map((resource, index) => (
                    <label key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                        <input
                            type="checkbox"
                            checked={weekProgress.resourcesCompleted[index]}
                            onChange={() => onToggle(week.weekNumber, "resource", index)}
                        />
                        {resource.title}
                    </label>
                ))}
            </div>

            <label className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                <input
                    type="checkbox"
                    checked={weekProgress.projectCompleted}
                    onChange={() => onToggle(week.weekNumber, "project", null)}
                />
                Project: {week.practiceProject}
            </label>

            <div className="space-y-2">
                {week.leetcodeTopics.map((topic, index) => (
                    <label key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                        <input
                            type="checkbox"
                            checked={weekProgress.leetcodeTopicsCompleted[index]}
                            onChange={() => onToggle(week.weekNumber, "leetcode", index)}
                        />
                        LeetCode: {topic}
                    </label>
                ))}
            </div>
        </div>
    );
}

export default ProgressWeekCard;