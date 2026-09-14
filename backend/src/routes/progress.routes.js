import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { markItemComplete,getMyProgress } from "../controllers/progress.controller.js";

const router = Router();

router.route("/mark-complete").post(verifyJWT, markItemComplete);
router.route("/my-progress").get(verifyJWT, getMyProgress);

export default router;