import User from "../models/User.js";

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

        
    }
    catch(error){

    }
}

export async function login(req,res){
    res.send("Login ");
}

export function logout(req,res){
    res.send("Logout");
}