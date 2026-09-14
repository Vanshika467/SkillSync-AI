// Login token deta hai; verifyJWT har protected request par us token ko check karke prove karta hai ki user authenticated hai.

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {

    //gar cookie me token nahi mila toh Authorization: Bearer <token> header se token nikalenge
    const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

if (!token) {
    throw new ApiError(401, "Unauthorized request");
}
const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
);

const user = await User.findById(decodedToken?._id)
    .select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, "Invalid Access Token");
    }
    
    req.user = user;//req.user ke andar verified logged-in user hai.
    next();

});


// auth.middleware.js
// ↓ export
// verifyJWT
//    ↓ import
// user.routes.js
//    ↓
// router.route("/logout").post(verifyJWT, logoutUser)