import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { extractTextFromPDF } from "../utils/resumeParser.js";
import fs from "fs";

const uploadResume = asyncHandler(async (req, res) => {

    const resumeLocalPath = req.file?.path;

    if (!resumeLocalPath) {
        throw new ApiError(400, "Resume file is required");
    }
    if (req.file?.mimetype !== "application/pdf") {
        fs.unlinkSync(resumeLocalPath);//file delete
        throw new ApiError(400, "Only PDF resumes are allowed");
    }
    const extractedText = await extractTextFromPDF(resumeLocalPath);

if (!extractedText) {
//fs.existsSync() pehle check karta hai ki file abhi exist karti bhi hai ya nahi. Isse already-deleted 
//file ko delete karne ki koshish me extra error nahi aayega.
    if (fs.existsSync(resumeLocalPath)) {
        fs.unlinkSync(resumeLocalPath);
    }
    throw new ApiError(400, "Could not extract text from resume");
}//Phir parser ko remote URL se file download/fetch karke parse karne ka extra step karna pad sakta tha. Jab local PDF already haath me hai, wo unnecessary hai.
    const uploadedResume = await uploadOnCloudinary(resumeLocalPath);

if (!uploadedResume) {
    throw new ApiError(500, "Failed to upload resume");
}
const resume = await Resume.create({
    owner: req.user._id,
    fileName: req.file.originalname,
    fileUrl: uploadedResume.secure_url,
    fileType: req.file.mimetype,//application or pdf type
    extractedText: extractedText,
});
return res
    .status(201)
    .json(
        new ApiResponse(201, resume, "Resume uploaded successfully")
    );
});
//Maan lo user ne time ke saath 3 resumes upload kiye:
//Ab frontend me future me "My Resumes" page banega. User ko apne uploaded resumes dikhane hain:
const getMyResumes = asyncHandler(async (req, res) => {

    const resumes = await Resume.find({
        owner: req.user._id
    });
    return res
    .status(200)
    .json(
        new ApiResponse(200, resumes, "Resumes fetched successfully")
    );

});
//ab next Get Single Resume by ID banayenge. Iski zarurat tab hogi
// jab dashboard par user kisi particular resume par click kare aur uski details/analysis open karni ho.

const getResumeById = asyncHandler(async (req, res) => {

    const { resumeId } = req.params;//So req.params URL se dynamic values nikalne ke kaam aata hai.

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }
    if (resume.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to access this resume");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, resume, "Resume fetched successfully")
    );
});

export { uploadResume,getMyResumes ,getResumeById};
// Multer → local PDF
//           ↓
//       TEXT EXTRACT
//           ↓
//       Cloudinary
//           ↓
//        MongoDB