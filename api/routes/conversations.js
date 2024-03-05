const router = require("express").Router();
const Message = require("../models/Messages");
const Conversation = require("../models/Conversation");

//get all messages of a conversation
router.get("/:conversationId", async(req, res)=>{
    const conversationId = req.params.conversationId;
    console.log(conversationId);

    try{
        const messages = await Message.find({conversationId: conversationId});
        messages.sort((p1, p2) => {
            return new Date(p1.createdAt) - new Date(p2.createdAt);
        })

        res.status(200).json(messages);
    }catch(err){
        res.status(500).json(err);
    }
    
})


router.get("/all/:id", async(req, res)=>{
    const userId = req.params.id;
    try{
        const cons = await Conversation.find();
        
        const Cons = cons.map((c) => {
            if(c.users.includes(userId)){
                return c;
            }
               
        });

        res.status(200).json(Cons)
    }catch(err){
        res.status(500).json(err)
    }
})


//new conversation
router.post("/", async(req, res)=>{
    const sender = req.body.senderId;
    const receiver = req.body.receiverId;

    try{
        const newCon = new Conversation({
            users:[sender, receiver]
        });

        const savedCon = await newCon.save();
        res.status(200).json("New conversation created");

        
    }catch(err){
        res.status(500).json(err);
    }
})

//delete conversation

router.delete("/:id", async(req, res)=>{
    try{
        const con = await Conversation.findById(req.params.id);
        if(con.users.includes(req.body.userId)){
            await Message.deleteMany({conversationId: req.params.id});
            await con.deleteOne();
            res.status(200).json("Conversation Deleted");
        }else{
            res.status(403).json("Delete access denied");
        }
        
        
    }catch(err){
        res.status(500).json(err);
    }
})






module.exports = router;