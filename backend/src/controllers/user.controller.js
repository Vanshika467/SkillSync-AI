import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const registerUser = asyncHandler(async (req, res) => {
// Step 1: Get data from request body

console.log("BODY:", req.body);
console.log("FILES:", req.files);
    const { fullName, email, username, password } = req.body;
// Step 2: Validate fields
    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    const existedUser = await User.findOne({//User mongoose model is used that why impirtes uder.model
        $or: [{ username }, { email }]// checking wheter user with tgis username or email exits
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path;// avatar is image array type store hoti hain ye

const coverImageLocalPath = req.files?.coverImage?.[0]?.path;//.? this is optional chahing agr like imag enhi upload ki toh eroor mat do undefined dene ke liye
if (!avatarLocalPath) {//user ne file upload nhi ki 
    throw new ApiError(400, "Avatar file is required");
}
const avatar = await uploadOnCloudinary(avatarLocalPath);
console.log("Avatar returned:", avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {// user ne file upload ki lekin cloudinary par upload fail ho gya null return

        throw new ApiError(400, "Avatar file is required");
    }
    const user = await User.create({// ye mongodb mein save karne ka part hain
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });
    //ye jo upar user create kiya hain doobara usko fimnda karke passored wagera remove kar arhe hain woh nhi bhje sakte
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
// server side se error
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    return res.status(201).json(
        new ApiResponse(
            200,
            createdUser,//isme password wagera remove isiliye isko bheha
            "User registered successfully"
        )
    );
});
const loginUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });
    
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);

if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
}
const accessToken = user.generateAccessToken();
const refreshToken = user.generateRefreshToken();

user.refreshToken = refreshToken;//Refresh Token user me set
await user.save({ validateBeforeSave: false });//MongoDB me save
const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
);

const options = {
    httpOnly: true,// normally cookie issue nhi ho sakrta 
    secure: true,
    sameSite: "none"
};
return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };
    //to logout me humne 2 jagah cleanup kiya:
    // MongoDB
    // refreshToken ❌
    //       +
    // Client Cookies
    // accessToken ❌
    // refreshToken ❌
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                req.user,
                "Current user fetched successfully"
            )
        );
});
// Refresh-token route par verifyJWT middleware nahi lagega,
//  but refresh token ko controller ke andar jwt.verify() se verify zaroor karenge. ✅
const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    );
    //Refresh token ke andar se user ki ID nikalo → us ID se MongoDB me actual user find karo → us user ko user variable me store karo.
    const user = await User.findById(decodedToken?._id);
    //database wala refresh token aur incoming refresh token same hain ya nahi.
    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }
    
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
    }
    const accessToken = user.generateAccessToken();
const newRefreshToken = user.generateRefreshToken();

user.refreshToken = newRefreshToken;
await user.save({ validateBeforeSave: false });

const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none"
};

return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken,
                refreshToken: newRefreshToken
            },
            "Access token refreshed successfully"
        )
    );
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
}
user.password = newPassword;
return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
    );

await user.save({ validateBeforeSave: false });//khud sab hojayega hashed bhi 
});
export{registerUser,loginUser,logoutUser,getCurrentUser,refreshAccessToken,changeCurrentPassword};
// findOne() → Sirf pehla matching document return karta hai (ya null).
//find() → Saare matching documents ki array return karta hai.
