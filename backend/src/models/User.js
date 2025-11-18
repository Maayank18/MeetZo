import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type:String,
            required: true,
            unique: true,
        },
        password: {
            type:String,
            required: true,
            minlength: 6,
        },
        bio: {
            type:String,
            default: "",
        },
        profilePic: {
            type: String,
            default: "",
        },
        nativeLanguage: {
            type: String,
            default: "",
        },
        learningLanguage: {
            type:String,
            default: "",
        },
        isOnboarded: { 
            type: Boolean,
            default: false,
        },
        friends:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps:true
    }
)

// should be done before creating the user Schema// pre hook fro hashing the password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return exit();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }
    catch(error){
        next(error);
    }
})

// creating a fucntion to check if the entered password is correct or not 
userSchema.methods.matchPassword = async function (enteredPassword){
    const isPasswordCorrect = await bcrypt.compare(enteredPassword,this.password);
    return isPasswordCorrect;
}

const User = mongoose.model("User",userSchema);


export default User;