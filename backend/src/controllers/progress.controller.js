import { Progress } from "../models/progress.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const markItemComplete = asyncHandler(async (req, res) => {
    const { weekNumber, type, itemIndex } = req.body;//frontend se ye sab aa raha hain 

    if (!weekNumber || !type) {
        throw new ApiError(400, "weekNumber and type are required");
    }

    const validTypes = ["resource", "project", "leetcode"];
    if (!validTypes.includes(type)) {
        throw new ApiError(400, "type must be resource, project, or leetcode");
    }
    const progress = await Progress.findOne({ owner: req.user._id }).sort({ createdAt: -1 });
    // used for latest progress

    if (!progress) {
        throw new ApiError(404, "No progress tracker found. Please generate a roadmap first.");
    }

    const weekEntry = progress.weeksProgress.find(//saare weeks ka progress hain 
        (w) => w.weekNumber === weekNumber
        //wo week jiska weekNumber field, humare request se aaye weekNumber se match kare
    );

    if (!weekEntry) {
        throw new ApiError(404, `Week ${weekNumber} not found in progress tracker`);
    }
    if (type === "resource") {
        if (itemIndex === undefined || itemIndex < 0 || itemIndex >= weekEntry.resourcesCompleted.length) {
            throw new ApiError(400, "Valid itemIndex is required for resource type");
        }
        weekEntry.resourcesCompleted[itemIndex] = true;
    }

    if (type === "leetcode") {
        if (itemIndex === undefined || itemIndex < 0 || itemIndex >= weekEntry.leetcodeTopicsCompleted.length) {
            throw new ApiError(400, "Valid itemIndex is required for leetcode type");
        }
        weekEntry.leetcodeTopicsCompleted[itemIndex] = true;
    }

    if (type === "project") {
        weekEntry.projectCompleted = true;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);// date ka time part hataya hain 

    let newStreak = progress.currentStreak;// ye progress document se nikala hain 

    if (!progress.lastActivityDate) {
        newStreak = 1;
    } else {
        const lastDate = new Date(progress.lastActivityDate);
        lastDate.setHours(0, 0, 0, 0);

        const diffInDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            newStreak = progress.currentStreak;
        } else if (diffInDays === 1) {
            newStreak = progress.currentStreak + 1;
        } else {
            newStreak = 1;
        }
    }

    progress.currentStreak = newStreak;// newstreak set hogyi
    progress.longestStreak = Math.max(progress.longestStreak, newStreak);
    progress.lastActivityDate = today;

    const newBadges = [];// ek array banaya hain saare badges stor karne ko 

    if (progress.currentStreak === 7 && !progress.badges.includes("7-day-streak")) {
//agar 7 days ka badge phele se hain toh baar baar nhi milega 
        newBadges.push("7-day-streak");
    }

    if (progress.currentStreak === 30 && !progress.badges.includes("30-day-streak")) {
        newBadges.push("30-day-streak");
    }

    const allResourcesInWeekDone = weekEntry.resourcesCompleted.every((item) => item === true);
    // every matlab har resource complete hain ya  nhi 
    const allLeetcodeInWeekDone = weekEntry.leetcodeTopicsCompleted.every((item) => item === true);

    if (
        allResourcesInWeekDone &&
        allLeetcodeInWeekDone &&
        weekEntry.projectCompleted &&
        !progress.badges.includes(`week-${weekNumber}-complete`)
    ) {
        newBadges.push(`week-${weekNumber}-complete`);
        //emplate literal se dynamic badge naam "week-1-complete"
    }

    if (newBadges.length > 0) {// ey bahut sare badges ko ek sath store karne ke liye hain 
        progress.badges.push(...newBadges);
    }
    await progress.save();// documnets laready save hain hamne bass updation kiya hain 

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    progress,
                    newBadgesEarned: newBadges,
                },
                "Progress updated successfully"
            )
        );
});
const getMyProgress = asyncHandler(async (req, res) => {
    const progress = await Progress.findOne({ owner: req.user._id }).sort({ createdAt: -1 });
    // sabse naye wale document ki progress dekhni hain 

    if (!progress) {
        throw new ApiError(404, "No progress tracker found. Please generate a roadmap first.");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, progress, "Progress fetched successfully"));
});

export { markItemComplete, getMyProgress };

