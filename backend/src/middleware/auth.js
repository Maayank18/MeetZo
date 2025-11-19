// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoute = async (req, res, next) => {
//   try {
//     // support cookie + authorization header (safer/flexible)
//     const token = req.cookies?.jwt || req.headers?.authorization?.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized - No token provided" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     if (!decoded) {
//       return res.status(401).json({ message: "Invalid token" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized - User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("error in the protectroute middleware", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };



import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from cookies (preferred)
    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    // 2. Or get token from Authorization header
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts[0] === "Bearer" && parts[1]) {
        token = parts[1];
      }
    }

    // If no token found
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 4. Find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // 5. Attach user and continue
    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token expired or invalid" });
  }
};
