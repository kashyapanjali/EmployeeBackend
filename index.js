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
app.use(cors());
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
