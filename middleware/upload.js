const fs = require("fs");
const multer = require("multer");
const path = require("path");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log("Uploading to:", uploadDir);
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		const filename = Date.now() + path.extname(file.originalname);
		console.log("Generated filename:", filename);
		cb(null, filename);
	},
});

const upload = multer({ storage: storage });

module.exports = upload;
