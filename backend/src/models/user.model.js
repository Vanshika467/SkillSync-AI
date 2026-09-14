import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema(//user schema dikhega kasie
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,//used for faster searching
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
  
      fullName: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
      avatar: {
        type: String,
        required: true,
    },
    
    coverImage: {
        type: String,
    },
    
    password: {
        type: String,
        required: true,
    },
    
    refreshToken: {
        type: String,
    },
    role:{
        type:String,
        enum:["user","admin"],// enum matlab structly bass ye do hi aa sakte hain 
        default:"user",// matlab koi nya register karega use user hi bola jyega 
    },
    },
    {
        timestamps:true,
    }
);
// pre means save karne se pehle async function so that
// we can use this arrow function not use ,this use karenge password lene ko then next age badho
userSchema.pre("save",async function (){
if(!this.isModified("password")) return; // means paswword modify nhi hua jo pehle tha wahi hain hashe tohb doobarahash nhi karna aage badho 
//agar like maan user ne user nanme change kara toh pre save dooobara hash kardega isiliye ye line use krte
   // return next();
    this.password = await bcrypt.hash(this.password, 10);// 10 saltround

//next();
});
userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);

};
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(//jwt.sign(payload, secret, options);
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id// only need to find user not extra info
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};
export const User=mongoose.model("User",userSchema)// tghis line converts schema into model
//objectid mongidb khud banata search karne ke liye unique identity
// password hashing one way we use thuis -- while encytion two ways we can decryt that and get the original one 


// Variable	Value
// password	User ne login me dala hua plain password (123456)
// this.password	Database me stored hashed password

//tokens---
// Login

// ↓

// Access Token (15 min)

// ↓

// 15 min baad expire

// ↓

// Refresh Token use karo

// ↓

// Naya Access Token mil gaya