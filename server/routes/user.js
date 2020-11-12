const express=require("express")
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("User")
const requireLogin=require('./middleware');
const { route } = require("./post");

router.put('/forkpost',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $push:{forkedPost:req.body.postId}
    },{
        new:true
    })
    .populate("forkedPost","_id title")
    .exec((err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.json(result);
        }
    })
})

router.put('/unforkpost',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $pull:{forkedPost:req.body.postId}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.json(result);
        }
    })
})



module.exports=router;