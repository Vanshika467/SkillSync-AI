// meaning of multer frontend se aayi file (image, pdf, video, etc.) ko receive karke server me save karna.

import multer from "multer";

const storage = multer.diskStorage({//Computer ke folder me save karo.
    destination: function (req, file, cb) {//means file kaha upload hogi
        //cb(error, value)
        cb(null, "./public/temp");
    },

    filename: function (req, file, cb) {//kis name se upload hogi
        cb(null, file.originalname);
    }
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,//5 mb
    },
});