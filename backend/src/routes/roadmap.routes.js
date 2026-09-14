import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createRoadmap,getMyRoadmap } from "../controllers/roadmap.controller.js";

const router = Router();

router.route("/generate").post(verifyJWT, createRoadmap);
router.route("/my-roadmap").get(verifyJWT, getMyRoadmap);

export default router;