import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { upsertStreamUser } from "../lib/stream.js";
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
        try{
            await upsertStreamUser({
                id:newUser._id.toString(),
                name:newUser.fullname,
                image:newUser.profilePic || "",
            });
            console.log(`Stream user created for ${newUser.fullname}`);
        }catch(error){
            console.log(" error creating a stream user",error);
        }

        const token = jwt.sign({userId: newUser._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "none", // prvent CSRF attack,
            // secure: process.env.NODE_ENV==="production" must be false on local host
            secure: false
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

    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message:"All fields are required"
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // check if the password is correct or not
        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }


        // if everyhting is correct we can create a token
        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
            expiresIn:"7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true, // prevent XSS attacks,
            sameSite: "strict", // prvent CSRF attack,
            secure: process.env.NODE_ENV==="production"
        });

        res.status(200).json({
            success:true,
            user
        });
    }
    catch(error){
        console.log("error in the login controller", error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export function logout(req,res){
    // here we just have to clear the cookies 
    res.clearCookie("jwt");
    res.status(200).json({
        success:true,
        message:"Logout successful"
    });
}

export async function onboard(req,res) {
    try{
        console.log("onboard: req.user:", req.user && req.user._id);
        console.log("onboard: req.body:", req.body);
        const userId = req.user._id;

        const {fullname, bio, nativeLanguage, learningLanguage, location} = req.body;

        if(!fullname || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(400).json({
                message:"Missing fields",
                missingFields: [
                    !fullname && "fullname",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        //  update the user who is onboarded
        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded : true,
        },{new:true})

        if(!updateUser){
            return res.status(400).json({
                message:"User not found"
            });
        }

        // TODO UPDATE TEH USER INFO IN THE STEAM
        try{
            await upsertStreamUser({
                id:updateUser._id.toString(),
                name:updateUser.fullname,
                image:updateUser.profilePic || "",
            });
            console.log(`Stream user ${updateUser.fullname}updated after the onboarding`)
        }catch(error){

        }

        res.status(200).json({
            success:true,
            user:updateUser
        });
    }
    catch(error){
        console.error("obboarding error ", error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}
