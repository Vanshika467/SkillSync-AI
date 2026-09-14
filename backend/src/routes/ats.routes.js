import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { analyzeResume,getAnalysisById } from "../controllers/ats.controller.js";

const router = Router();
router
    .route("/analyze/:resumeId")
    .post(verifyJWT, analyzeResume);
    router.route("/:analysisId").get(verifyJWT, getAnalysisById);
    export default router;