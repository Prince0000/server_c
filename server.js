const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://your-frontend-domain.com', // Replace with your actual frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials if needed
}));
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging requests
app.use(express.json()); // Parse JSON request bodies

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);
app.use("/api/jobs", jobRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).send('Something broke!'); // Respond with a generic error message
});

// Start the server
const PORT = process.env.PORT || 5000; // Use the port from environment or default to 5000 for local development
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
