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
        .populate("comments.commentedBy","_id name")
        .populate("postedby","_id name ")
        .then((allPosts)=>{
            console.log(allPosts)
            res.json(allPosts);
        })
        .catch((err)=>{
            console.log(err);
        })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic}=req.body;

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
        pic:pic,
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
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            // console.log(result)
            // console.log(result.comments[0].commentedBy.name)
            res.json(result);

        }
    })

    // console.log(req.user.name)
})

router.delete('/delete/:postId',requireLogin,(req,res)=>{
    
    // console.log(typeof(req.params.postId))
    
    Post.findOne({_id:req.params.postId})
    .populate("postedby"," _id")
    .then((postToDelete)=>{
        console.log("deleted")
        console.log(req.user._id.toString());
        console.log(postToDelete.postedby._id.toString());
        if(postToDelete.postedby._id.toString() === req.user._id.toString())
        {
            postToDelete.remove()
            .then(result=>{
                // console.log("triggered")
                console.log(result)
                res.json("deleted successfully");
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        else
        {
            res.json("error: invalid user");
        }
        // return res.json({postToDelete});
    })
    .catch((err)=>{
        console.log(err);
    })
})

module.exports=router;