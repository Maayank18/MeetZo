// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import authRoutes from "./routes/auth.js"
// import userRoutes from "./routes/user.js"
// import chatRoutes from "./routes/chat.js";
// import { connectDB } from "./lib/db.js";
// const app = express();
// import cookieParser from "cookie-parser";
// app.use(express.json());
// app.use(cookieParser());

// dotenv.config();


// const PORT = process.env.PORT;

// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials:true // allow frontend to send the cookies
// }))


// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/chat", chatRoutes);


// app.listen(PORT, ()=> {
//     console.log("server is running  on 5001 port");
//     connectDB();
// })

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import { connectDB } from "./lib/db.js";

// Load environment variables FIRST
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ---- Middlewares ----
app.use(express.json());
app.use(cookieParser());

// CORS (MUST include credentials for cookies to work)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ---- Start Server Only After DB Connect ----
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
