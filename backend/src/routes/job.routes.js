import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { searchJobs,marketSkillAnalysis,matchJobs } from "../controllers/job.controller.js";
const router = Router();
router
    .route("/search")
    .get(verifyJWT, searchJobs);
    router.route("/market-demand").get(verifyJWT, marketSkillAnalysis);
    router.route("/match").get(verifyJWT, matchJobs);
export default router;