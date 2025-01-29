const multer = require("multer");

// Configure Multer for Profile Picture Upload
const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload1 = multer({ storage1 });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/profile_pictures");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = {
    upload,
    upload1
};
