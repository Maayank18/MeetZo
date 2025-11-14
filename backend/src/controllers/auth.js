import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function signup(req,res){
    const {email, password, fullname} = req.body;

    try{
        // checking if all deatils are there or not 
        if(!email || !password || !fullname){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        // if password length is less than the required length
        if(password.length < 6){
            return res.status(400).json({
                message:"Password must be at last of 6 characters"
            });
        }

        // check if the email sent by the user is correct or not
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message:" Invalid email format"
            });
        }

        // check if the user is already existed or not 
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"Email existed already , please use another email"
            });
        }

        
        const idx = Math.floor(Math.random()*100) + 1; // generate a number between 1 and 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        // now we will be creating a new user in our database
        const newUser = await User.create({
            email,
            fullname,
            password,
            profilePic: randomAvatar,
        });

        // TODO : we must also create the user in the steam

        const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prvent CSRF attack,
            secure: process.env.NODE_ENV==="production"
        })

        res.status(201).json({
            success:true,
            user: newUser,
        })
    }
    catch(error){
        console.log("Error in the sign up controller ", error);
        res.status(500).json({
            message:"Internal server error"
        });
    }
}






export async function login(req,res){
    res.send("Login ");
}

export function logout(req,res){
    res.send("Logout");
}