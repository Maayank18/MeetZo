// import express from "express";
// const router = express.Router();
// import { signup, login, logout } from "../controllers/auth.js";
// import { protectRoute } from "../middleware/auth.js";
// import { onboard } from "../controllers/auth.js";

// router.post("/signup", signup);
// router.post("/login", login);
// router.post("/logout", logout);

// // we must protect this route so that only authenticated user can visit this 
// router.post("/onboarding",protectRoute, onboard);

// export default router;

import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;