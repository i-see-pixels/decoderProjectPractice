const express=require("express")
const router=express.Router();
const mongoose=require("mongoose");
const User=mongoose.model("User")
const requireLogin=require('./middleware');
const { route } = require("./post");

router.get('/test',(req,res)=>{
    console.log("triggered");
})

router.put('/forkpost',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $push:{forkedPost:req.body.postId}
    },{
        new:true
    })
    .populate("forkedPost","_id title")
    .exec((err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
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

router.post('/rich',(req,res)=>{
    const content=req.body;
    // console.log(typeof(content.blocks))
    console.log(content.content.blocks[0].text)
    res.json(content.content.blocks[0].text)
})

router.get('/getforkpost',requireLogin,(req,res)=>{
    User.findById(req.user._id)
        // .populate("forkedPost","_id title body likes pic comments")
        // .populate("forkedPost.comments.commentedBy","_id name")

        .populate({                         // learnt this from Stack overflow
            path:'forkedPost',              // this is an important and useful concept
            populate:{                      //ALWAYS KEEP THE TECHNIQUE IN MIND
                path:'comments',            //https://stackoverflow.com/questions/19222520/populate-nested-array-in-mongoose
                populate:{
                    path:'commentedBy',
                    select:'name'
                }
            }
        })
        .then(posts=>{
            // console.log(posts.forkedPost)
            res.json(posts.forkedPost)
        })
        .catch((err)=>{
            console.log(err)
        })
})

module.exports=router;