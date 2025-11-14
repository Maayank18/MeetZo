import {StreamChat} from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apikey = process.env.MEETZO_API_KEY;
const secretkey = process.env.MEETZO_API_SECRET;

if(!apikey || !secretkey){
    console.error("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(apikey, secretkey);

export const upsertStreamUser = async (userData) => {
    try{
        await streamClient.upsertUsers([userData]); // create or update 
        return userData;
    }
    catch(error){
        console.error(" error upserting stream user", error);
    }
}

export const generateStreamToken = (userId) => {
    
}