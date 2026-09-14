import {v2 as cloudinary} from "cloudinary";//sdk cloudinary imported it will give us function upload
import fs from "fs";//file system we can delete read move file

console.log(process.env.CLOUDINARY_API_KEY);
cloudinary.config({// these are i guess account details
   
    
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log(cloudinary.config());

const uploadOnCloudinary = async (localFilePath) => {//localfilepath parameter like vatarupload jo bhi uploaf ksr rahe 
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            timeout: 60000,//means pdf toh pdf upload file ka type khud detect karo
        });
        fs.unlinkSync(localFilePath);//Cloudinary par permanent copy already aa gayi, isliye local temporary copy rakhne ka koi fayda nahi.
        return response;
    } catch (error) {
        console.log("Cloudinary Error:");
        console.log(error);
        fs.unlinkSync(localFilePath);//error waste file khud delete ho jayegi 
        return null;
    }
};
export { uploadOnCloudinary };