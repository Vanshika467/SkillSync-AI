import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();
// we are using all thses thing beacuse in this file we have to 
// call it iundividually no calling in app.js

const makeAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Connected to MongoDB");

        const emailToMakeAdmin = process.argv[2];// node srcscrip email ais elikhneg to email elne ka traika 

        if (!emailToMakeAdmin) {
            console.log("Please provide an email. Usage: node makeAdmin.js user@example.com");
            process.exit(1);// error 1 kamatlav 
        }

        const user = await User.findOneAndUpdate(
            { email: emailToMakeAdmin },
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            console.log("No user found with this email");
        } else {
            console.log(`Success! ${user.email} is now an admin.`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

makeAdmin();// ab jaake function actually chalega