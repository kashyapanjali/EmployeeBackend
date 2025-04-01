const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/"); // Store files in 'uploads' folder
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		);
	},
});

// File Filter (Allow Only Images & PDFs)
const fileFilter = (req, file, cb) => {
	const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Only images and PDFs are allowed!"), false);
	}
};

// Multer Upload Middleware
const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
	fileFilter: fileFilter,
});

module.exports = upload;
