import { Router } from "express";
import { registerUser,loginUser,logoutUser,getCurrentUser ,refreshAccessToken,changeCurrentPassword} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/refresh-token").post(refreshAccessToken);
router
    .route("/change-password")
    .post(verifyJWT, changeCurrentPassword);
export default router;
// verifyJWT ka kaam hai check karna:

// "Jo request kar raha hai, kya woh already logged-in authenticated user hai?"

// GET	Data lene/read ke liye	User profile lana
// POST	Data/action submit/create karne ke liye