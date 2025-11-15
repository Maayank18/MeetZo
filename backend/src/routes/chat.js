import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { getStreamToken } from "../controllers/chat.js";

const router = express.Router();

// this token is needed for stream to authencticate use rand make it more safer
router.get("/token", protectRoute, getStreamToken);

export default router;