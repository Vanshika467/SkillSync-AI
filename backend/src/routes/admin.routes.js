import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { getPlatformStats,getPlatformMissingSkillsTrend  } from "../controllers/admin.controller.js";

const router = Router();

router.route("/stats").get(verifyJWT, verifyAdmin, getPlatformStats);
router.route("/missing-skills-trend").get(verifyJWT, verifyAdmin, getPlatformMissingSkillsTrend);
export default router;