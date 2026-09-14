import "dotenv/config";
import connectDB from "./db/index.js";
import app from "./app.js";

// dotenv.config({
//     path:"./.env"
// });
console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Key:", process.env.CLOUDINARY_API_KEY);
console.log("Secret:", process.env.CLOUDINARY_API_SECRET);

connectDB()// await mongoose call higa isilkiye promise retuen hoga
.then(()=>{

    app.listen(process.env.PORT || 8000,()=>{

        console.log(
            `Server running on ${process.env.PORT}`
        );

    });

})
.catch((error)=>{

    console.log("Mongo Connection Failed",error);

});
// connectDB()

// ↓

// MongoDB connect ho raha hai

// ↓

// Connection successful

// ↓

// then()
// connectDB()

// ↓

// MongoDB Down

// ↓

// catch()