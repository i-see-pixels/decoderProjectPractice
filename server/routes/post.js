const express=require("express")
const router=express.Router();
const mongoose=require("mongoose");
const Post=mongoose.model("Post")
const requireLogin=require('./middleware');
const {ADMIN_PRIVILEDGE} = require('../keys');
const { route } = require("./user");
// const { route } = require("./authentication");

router.get('/allposts',requireLogin,(req,res)=>{
    Post.find()
        .populate("postedby","_id name ")
        .then((allPosts)=>{
            res.json({allPosts});
        })
        .catch((err)=>{
            console.log(err);
        })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body}=req.body;

    if(!title || !body)
    {
        return res.status(422).json({error:"title or body missing"})
    }


    // THIS GIVES ONLY ADMINS ACCESS TO POST
    // if(req.email != ADMIN_PRIVILEDGE)
    // {
    //     return res.status(422).json({error:"you are not authorized"})
    // }

    const newPost=new Post({
        title:title,
        body:body,
        postedby:req.user,
    })

    console.log(req.user);

    newPost.save()
           .then(()=>{
               res.json({message:"post created successfully"})
               console.log("post saved successfully")
           })
           .catch((err)=>{
               console.log(err);
           })
})

router.get('/myposts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user})
        .then((myPosts)=>{
            res.json({myPosts})    //myPosts is an array of objects
        })
        .catch((err)=>{
            console.log(err);
        })
})

router.put('/likepost',requireLogin,(req,res)=>{
    Post.findById(req.body.postId)
        .then((foundPost)=>{
            foundPost.likes.push(req.user)
            foundPost.save();
            // console.log(foundPost)
            res.json({message:foundPost.likes.length+" likes"})
        })
        .catch(err=>{
            console.log(err)
        })


    // THIS IS THE ALTERNATIVE APPROACH TO UPDATE THE LIKES ARRAY
    // DESCRIPTION AVAILABLE ON STACK OVERFLOW

    // Post.findByIdAndUpdate(req.body.postId,{
    //     $push:{likes:req.user}
    // },{
    //     new:true
    // },(err,result)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
    //         res.json({message:result.likes.length+" likes"})
    //     }
    // })
})

router.put('/unlikepost',requireLogin,(req,res)=>{
    Post.findById(req.body.postId)
        .then((postFound)=>{
            postFound.likes.pull(req.user);
            postFound.save();
            // console.log(postFound);
            res.json({message:postFound.likes.length+" likes"})
        })
        .catch((err)=>{
            console.log(err)
        })
    
    // THIS IS THE ALTERNATIVE APPROACH TO UPDATE THE LIKES ARRAY
    // DESCRIPTION AVAILABLE ON STACK OVERFLOW

    // Post.findByIdAndUpdate(req.body.postId,{
    //     $pull:{likes:req.user._id}
    // },{
    //     new:true
    // },(err,result)=>{
    //     if(err)
    //     {
    //         console.log(err);
    //     }
    //     else
    //     {
    //         res.json({message:result.likes.length+" likes"})
    //     }
    // })
})

router.put('/comment',requireLogin,(req,res)=>{
    const newComment={
        commentBody:req.body.commentBody,
        commentedBy:req.user._id
    }

    // NOT ABLE TO POPULATE IN THIS METHOD
    // Post.findById(req.body.postId)
    //     .then((foundPost)=>{
    //         foundPost.comments.push(newComment);

    //         foundPost.save();
    //         console.log(foundPost);
    //         res.json(foundPost)
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:newComment}
    },{
        new:true
    })          // QUERY WILL BE RETURNED BY MONGOOSE
    .populate("comments.commentedBy","_id name")
    // .populate("commentedBy","_id name")
    .exec((err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            res.json(result);
        }
    })
})

router.delete('/delete/:postId',requireLogin,(req,res)=>{
    
    console.log(typeof(req.params.postId))
    
    // Post.findOne({_id:req.params.postId})
    // .then((postToDelete)=>{
    //     console.log("deleted")
    //     return res.json({postToDelete});
    // })
})

module.exports=router;