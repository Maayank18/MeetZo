import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req,res){
    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and:[
                {_id:{$ne: currentUserId}},
                {_id:{$nin:currentUser.friends}}, // bug caught here instead of dollar it should be _
                {isOnboarded:true} // exclude the current user that is me
            ]
        })

        res.status(200).json(
            recommendedUsers
        );
        
    }catch(error){
        console.error("Error in getting the recommendedUsers", error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

export async function getMyFriends(req,res){
    try{
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullname profilePic nativeLanguage learningLanguage");

        res.status(200).json(
            user.friends
        );

    }catch(error){
        console.error("Error in getting the friends", error);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}

export async function sendFriendRequest(req,res){
    try{
        console.log("SEND REQ: req.user:", req.user && { id: req.user.id, _id: req.user._id });
console.log("SEND REQ: params:", req.params);

        const myId = req.user.id; // my current id 
        const {id: recipientId} = req.params; // id of other user

        // prevetn sending request to yourself
        if(myId == recipientId){
            return res.status(400).json({
                message:"You cant send friend request to yourself"
            });
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(400).json({
                message:"Recipient not found"
            });
        }

        // what if we are already friend with each other
        if(recipient.friends.includes(myId)){
            return res.status(400).json({
                message:"Your are already friends with this user"
            });
        }

        // check if we have already send a request
        // debugged changes 
        const existingRequest = await FriendRequest.findOne({
            $or: [
              { sender: myId, recipient: recipientId },       // I sent to you
              { sender: recipientId, recipient: myId },       // You sent to me
            ],
          });
          

        if(existingRequest){
            return res.status(400).json({
                message:"Request already exits"
            });
        }

        //  if we have surpass all the check we can make a frined Request
        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    }catch(error){
        console.error("error while creating a friend request", error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}

export async function acceptFriendRequest(req,res) {
    try{
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({
                message:"FriendRequest not found"
            });
        }

        // verify if the current user is recipient
        if(friendRequest.recipient.toString() != req.user.id){
            return res.status(403).json({
                message:"You are not authorised to accept this reuqest"
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // add each user to each other freiends array
        // $add to set adds eleemtn to ana array only if they do not already exist
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet: { friends:friendRequest.sender},
        });
    }catch(error){

    }
}

export async function getFriendRequest(req,res){
    try{
        const incomingRequest = await FriendRequest.find({
            recipient: req.user.id,
            status:"pending",
        }).populate("sender","fullname profilePic nativeLanguage learningLanguage");

        const acceptedRequest = await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient","fullname profilePic");

        res.status(200).json({incomingRequest,acceptedRequest})
    }catch(error){
        console.error("error in getting the friend request",error);
        res.status(500).json({
            message:"Internal Server Error"
        }); 
        
    }
}

export async function getOutgoingFriendReqs(req,res){
    try{
        const outgoingRequest = await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","fullname profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequest);
    }catch(error){
        console.error("error while getting the out going friends request", error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
}