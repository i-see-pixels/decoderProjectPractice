// const { ObjectID } = require("mongodb");
const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types;
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:false
    },
    likes:[
        {type:ObjectId,
        ref:"User"}
    ],
    comments:[
        {
            commentBody:{
                type:String,
                required:true
            },
            commentedBy:{               
                type:ObjectId,          
                ref:"User"              
            }
        }
    ],
    postedby:{
        type:ObjectId,
        ref:"User",
    },
});

mongoose.model("Post",postSchema);

