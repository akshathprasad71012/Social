const router = require("express").Router();
const Message = require("../models/Messages");
const Conversation = require("../models/Conversation");


//new message
router.post("/", async(req, res)=>{
    const sender =  req.body.senderId;
    const text = req.body.text;
    const conversation = req.body.conversationId;
    try{
        const newMessage = new Message({
            conversationId: conversation,
            text: text,
            sender: sender
        });
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }catch(err){
        res.status(500).json(err);
    }

})

//delete a message

router.delete("/:id", async(req, res)=>{
    try{
        const mes = await Message.findById(req.params.id);
        if(mes.sender === req.body.userId){
            await mes.deleteOne();
            res.status(200).json("Message Deleted");
        }else{
            res.status(403).json("Delete access denied");
        }
        
        
    }catch(err){
        res.status(500).json(err);
    }
})

//edit a message

router.put("/:id", async(req, res)=>{
    try{
        const message = await Message.findById(req.params.id);
        if(message.sender === req.body.userId){
            await message.updateOne({text: req.body.text});
            res.status(200).json("Message Editted");
        }else{
            res.status(403).json("edit access denied");
        }

    }catch(err){
        res.status(500).json(err);
    }
})



module.exports = router;