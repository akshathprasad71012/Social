const router = require("express").Router();
const User = require("../models/Users");
const Conversation = require("../models/Conversation");
const Messages = require("../models/Messages");
const bcrypt = require("bcryptjs");
const Users = require("../models/Users");

router.get("/all", async (req, res)=>{
    try{
        const result = await Users.find();
        result_usernames = []
        result.forEach(user => {
            result_usernames.push({
                id: user.id,
                profilePicture: user.profilePicture,
                username: user.username
            });
        })
        res.status(200).json(result_usernames);

    }catch(err){
        res.status(500).json(err);
    }
    
})

//update user


router.get("/conversations/:id", async (req, res)=>{
    try{
        const cons = await Conversation.find({users: req.params.id});
        res.status(200).json(cons);

    }catch(err){
        res.status(500).json(err);
    }
})







router.put("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            }catch(err){
                return res.status(500).json("err");
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set: req.body,
            });
            res.status(200).json("Account updated")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("only update ur account")
    }
})
//delete user
router.delete("/:id", async (req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account deleted")
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("only delete ur account")
    }
})
//get a user by id
router.get("/:id", async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err)
    }
})
//get user by username

router.get("/username/:username", async (req, res)=>{
    try{
        const user = await User.findOne({username: req.params.username});
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    }catch(err){
        res.status(500).json(err)
    }
})

//follow user
router.put("/:id/follow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({ $push : {followers: req.body.userId}});
                await currentUser.updateOne({ $push : {followings : req.params.id}});
                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("you already follow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Cant follow yourself")
    }
})
//unfollow user
router.put("/:id/unfollow", async (req, res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull : {followers: req.body.userId}});
                await currentUser.updateOne({ $pull : {followings : req.params.id}});
                res.status(200).json("user has been unfollowed");
            }else{
                res.status(403).json("you already unfollow this user");
            }
        }catch(err){
            res.status(500).json(err);
        }
    }else{
        res.status(403).json("Cant unfollow yourself")
    }
})

module.exports = router;
