import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
import chatRoutes from "./routes/chat.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);


app.listen(PORT, ()=> {
    console.log("server is running  on 5001 port");
    connectDB();
})