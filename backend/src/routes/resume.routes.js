import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadResume,getMyResumes ,getResumeById} from "../controllers/resume.controller.js";

const router = Router();
router.route("/upload").post(
    verifyJWT,
    upload.single("resume"),//Multer ek file receive karega + req.file set
    uploadResume//Cloudinary → MongoDB ✅
);
router
    .route("/my-resumes")
    .get(verifyJWT, getMyResumes);
router
    .route("/:resumeId")
    .get(verifyJWT, getResumeById);
export default router;
//POST /upload       → naya resume create/upload
//GET /my-resumes    → existing resumes read/fetch