import mongoose from "mongoose";
import { DB_NAME } from "../constants/constants.js";

const connectDB = async () => {// async function because mongodb connext hone mein time lagta hain 
    try {

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
        );

        console.log(
            `MongoDB Connected!! DB HOST : ${connectionInstance.connection.host}`
        );

    } catch (error) {

        console.log("MongoDB Connection Failed", error);

        process.exit(1);
    }
};

export default connectDB;