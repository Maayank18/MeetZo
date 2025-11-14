import express from "express";
const router = express.Router();
import { signup, login, logout } from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";
import { onboard } from "../controllers/auth.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// we must protect this route so that only authenticated user can visit this 
router.post("/onboarding",protectRoute, onboard);

export default router;