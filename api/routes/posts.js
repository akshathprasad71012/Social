const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/Users");
//create a post

router.post("/", async(req, res)=>{
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
})

//update post

router.put("/:id", async (req, res)=>{
    const post = await Post.findById(req.params.id);
    try{
        //console.log(req.params.id, " ---> ", req.body.userId);
        if(post.userId === req.body.userId){
            await post.updateOne({$set: req.body});
            res.status(200).json("update done")
        }else{
            res.status(403).json("cant update others post")
        }
    }catch(err){
        res.status(500).json(err);
    }
    
})

//delete post

router.delete("/:id", async (req, res)=>{
    const post = await Post.findById(req.params.id);
    try{
        //console.log(req.params.id, " ---> ", req.body.userId);
        if(post.userId === req.body.userId){
            await post.deleteOne();
            res.status(200).json("delete done")
        }else{
            res.status(403).json("cant delete others post")
        }
    }catch(err){
        res.status(500).json(err);
    }
    
})

//like post
router.put("/:id/like", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("liked the post");
        }else{
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("disliked the post");
        }
    }catch(err){
        res.status(500).json(err);
    }
})
//get a post

router.get("/:id", async (req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
        res.status(500).json(err);
    }
})

router.get("/profile/:username", async (req, res)=>{
    //let postArray = [];
    try{
        const currentUser = await User.findOne({username: req.params.username});
        const userPosts = await Post.find({userId: currentUser._id});
        res.status(200).json(userPosts)
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})



//get timeline posts


router.get("/timeline/:userId", async (req, res)=>{
    //let postArray = [];
    try{
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId: currentUser._id});
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({userId: friendId})
            })
        );
        res.json(userPosts.concat(...friendPosts));
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;