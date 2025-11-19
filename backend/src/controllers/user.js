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

// export async function sendFriendRequest(req,res){
//     try{
//         console.log("SEND REQ: req.user:", req.user && { id: req.user.id, _id: req.user._id });
// console.log("SEND REQ: params:", req.params);

//         const myId = req.user.id; // my current id 
//         const {id: recipientId} = req.params; // id of other user

//         // prevetn sending request to yourself
//         if(myId == recipientId){
//             return res.status(400).json({
//                 message:"You cant send friend request to yourself"
//             });
//         }

//         const recipient = await User.findById(recipientId);
//         if(!recipient){
//             return res.status(400).json({
//                 message:"Recipient not found"
//             });
//         }

//         // what if we are already friend with each other
//         if(recipient.friends.includes(myId)){
//             return res.status(400).json({
//                 message:"Your are already friends with this user"
//             });
//         }

//         // check if we have already send a request
//         // debugged changes 
//         const existingRequest = await FriendRequest.findOne({
//             $or: [
//               { sender: myId, recipient: recipientId },       // I sent to you
//               { sender: recipientId, recipient: myId },       // You sent to me
//             ],
//           });
          

//         if(existingRequest){
//             return res.status(400).json({
//                 message:"Request already exits"
//             });
//         }

//         //  if we have surpass all the check we can make a frined Request
//         const friendRequest = await FriendRequest.create({
//             sender:myId,
//             recipient: recipientId,
//         });

//         res.status(201).json(friendRequest);
//     }catch(error){
//         console.error("error while creating a friend request", error);
//         return res.status(500).json({
//             message:"Internal server error"
//         });
//     }
// }

// export async function acceptFriendRequest(req,res) {
//     try{
//         const {id:requestId} = req.params;
//         const friendRequest = await FriendRequest.findById(requestId);

//         if(!friendRequest){
//             return res.status(404).json({
//                 message:"FriendRequest not found"
//             });
//         }

//         // verify if the current user is recipient
//         if(friendRequest.recipient.toString() != req.user.id){
//             return res.status(403).json({
//                 message:"You are not authorised to accept this reuqest"
//             });
//         }

//         friendRequest.status = "accepted";
//         await friendRequest.save();

//         // add each user to each other freiends array
//         // $add to set adds eleemtn to ana array only if they do not already exist
//         await User.findByIdAndUpdate(friendRequest.recipient,{
//             $addToSet: { friends:friendRequest.sender},
//         });
//     }catch(error){

//     }
// }

// export async function getFriendRequest(req,res){
//     try{
//         const incomingRequest = await FriendRequest.find({
//             recipient: req.user.id,
//             status:"pending",
//         }).populate("sender","fullname profilePic nativeLanguage learningLanguage");

//         const acceptedRequest = await FriendRequest.find({
//             sender:req.user.id,
//             status:"accepted",
//         }).populate("recipient","fullname profilePic");

//         res.status(200).json({incomingRequest,acceptedRequest})
//     }catch(error){
//         console.error("error in getting the friend request",error);
//         res.status(500).json({
//             message:"Internal Server Error"
//         }); 
        
//     }
// }

// export async function getOutgoingFriendReqs(req,res){
//     try{
//         const outgoingRequest = await FriendRequest.find({
//             sender:req.user.id,
//             status:"pending",
//         }).populate("recipient","fullname profilePic nativeLanguage learningLanguage");

//         res.status(200).json(outgoingRequest);
//     }catch(error){
//         console.error("error while getting the out going friends request", error);
//         return res.status(500).json({
//             message:"Internal server error"
//         });
//     }
// }


/**
 * GET /api/users/requests/outgoing
 */
export async function getOutgoingFriendReqs(req, res) {
  try {
    const userId = req.user._id?.toString() ?? req.user.id;

    const outgoingRequests = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).populate("recipient", "fullname profilePic nativeLanguage learningLanguage");

    return res.status(200).json(outgoingRequests);
  } catch (error) {
    console.error("error while getting outgoing friend requests", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/users/requests
 * Returns:
 *  - incoming pending requests (where recipient is me)
 *  - accepted requests involving me (either sender or recipient)
 */
export async function getFriendRequest(req, res) {
  try {
    const userId = req.user._id?.toString() ?? req.user.id;

    const incomingRequest = await FriendRequest.find({
      recipient: userId,
      status: "pending",
    }).populate("sender", "fullname profilePic nativeLanguage learningLanguage");

    const acceptedRequest = await FriendRequest.find({
      status: "accepted",
      $or: [{ sender: userId }, { recipient: userId }],
    }).populate("sender recipient", "fullname profilePic");

    return res.status(200).json({ incomingRequest, acceptedRequest });
  } catch (error) {
    console.error("error in getting the friend requests", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * POST /api/users/:id/send-request
 */
export async function sendFriendRequest(req, res) {
  try {
    // debug logs are useful in dev
    console.log("SEND REQ: req.user:", req.user && { id: req.user.id, _id: req.user._id });
    console.log("SEND REQ: params:", req.params);

    const myId = req.user._id?.toString() ?? req.user.id;
    const recipientId = req.params.id;

    // prevent sending request to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send a friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if already friends (compare ids as strings)
    const alreadyFriends = (recipient.friends || []).some(
      (f) => f.toString() === myId
    );
    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check for an existing friend request in either direction
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId }, // I sent to you
        { sender: recipientId, recipient: myId }, // You sent to me
      ],
    });

    if (existingRequest) {
      // If there is a pending or accepted request, we don't create a new one
      if (existingRequest.status === "pending") {
        return res.status(400).json({ message: "A pending request already exists" });
      }
      if (existingRequest.status === "accepted") {
        return res.status(400).json({ message: "You are already friends" });
      }
      // If status is 'rejected' you might want to allow resending; for now we allow new request
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });

    // populate before sending back (optional)
    await friendRequest.populate("recipient", "fullname profilePic nativeLanguage learningLanguage");

    return res.status(201).json(friendRequest);
  } catch (error) {
    console.error("error while creating a friend request", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/users/requests/:id/accept
 */
export async function acceptFriendRequest(req, res) {
  try {
    const requestId = req.params.id;
    const userId = req.user._id?.toString() ?? req.user.id;

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // verify if the current user is recipient
    if (friendRequest.recipient.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }

    // if already accepted, short-circuit
    if (friendRequest.status === "accepted") {
      return res.status(400).json({ message: "This request is already accepted" });
    }

    // update status
    friendRequest.status = "accepted";
    await friendRequest.save();

    // add each user to each other's friends array
    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    // Optionally populate result to return
    const populated = await FriendRequest.findById(requestId).populate(
      "sender recipient",
      "fullname profilePic"
    );

    return res.status(200).json({ success: true, friendRequest: populated });
  } catch (error) {
    console.error("error in acceptFriendRequest:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
