//load .env variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

//import routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes= require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express()

//middleware
app.use(express.json()); //allow JSON in request body 
app.use(cors()); //enable CORS

app.get("/", (req, res) => {
  res.json({message: "API is running"});
})

//connect to database
connectDB();

//use auth routes
app.use("/api/auth", authRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications",applicationRoutes);

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
