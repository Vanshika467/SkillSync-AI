import {ApiError} from "../utils/ApiError.js";
 const verifyAdmin=(req,res,next)=>{
    if(req.user?.role !=="admin"){// ye verifyjwt se user nikala ? iska matlab agar user exist toh role nikalo nhi toh undeined 
        throw new ApiError(403,"Access denied. Admin privileges required.")
    }
    next();// controller par chalao
 };
 export {verifyAdmin}
 // verifyjwt->verifyadmin->getstarts 
 // admin analytice means admin poora view dekh sake dashboard ka 