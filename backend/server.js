const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const { Server } = require("socket.io");

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const profileRoutes = require("./routes/profileRoutes");

// SOCKET SERVICE
const { initSocket } = require("./services/socketService");

dotenv.config();

connectDB();

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development
      "https://exmify.vercel.app", // Production frontend
    ],
    credentials: true,
  })
);

app.use(express.json());

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("Online Exam System API is running...");
});

/* =======================
   API ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);

/* =======================
   SOCKET.IO SERVER
======================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://exmify.vercel.app/",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});