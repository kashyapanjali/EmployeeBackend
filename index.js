const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const employeeRoute = require("./routes/employeeRoute");
const morgan = require("morgan");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"https://employee-manage-app.netlify.app/",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);
app.use(express.json());
app.use(bodyParser.json());
app.use(morgan("tiny"));

// Serve static files (uploads directory)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/employees", employeeRoute);

app.get("/", (req, res) => {
	res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
