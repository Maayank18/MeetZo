// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoute = async (req,res,next) => {
//     try{
//         const token = req.cookie.jwt;

//         if(!token){
//             return res.status(401).json({
//                 message:"Unauthorized - No token provided"
//             });
//         }

//         // if user has the token we must verify it 
//         const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         if(!decode){
//             return res.status(401).json({
//                 message:"You have the token but it is an invalid token hence unauthorized "
//             });
//         }

//         //  if everything goes well
//         // debug change 
//         const user = await User.findById(decode.userId).select("-password");

//         if(!user){
//             return res.status(401).json({
//                 message:"Unauthorized - User not found"
//             });
//         }

//         req.user = user;
//         next();

//     }catch(error){
//         console.log("error in the protectroute middleware", error);
//         return res.status(500).json({
//             message:"Internal server error"
//         });
//     }
// }

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // support cookie + authorization header (safer/flexible)
    const token = req.cookies?.jwt || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("error in the protectroute middleware", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
