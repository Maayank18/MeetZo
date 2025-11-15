import express from "express";
import { protectRoute } from "../middleware/auth.js";
const router = express.Router();
import { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest } from "../controllers/user.js";

// apply authentication routes middle to all the routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

// put becuase we are updating something 
router.put("/friend-request/:id/accept", acceptFriendRequest);

export default router;