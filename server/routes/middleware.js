
// THIS IS WHOLE OF A LEARNING PART 
// THE SYNTAX IS MORE OR LESS FIXED


const express=require("express")
const jwt=require("jsonwebtoken");
const {JWT_SECRET_KEY}=require('../keys')
const mongoose=require("mongoose")
const User=mongoose.model("User")

module.exports=(req,res,next)=>{
    const {authorization}=req.headers;
    if(!authorization)
    {
        return res.status(401).json({message:"you are not logged in"})
    }
    const token=authorization.replace("Bearer ","");
    jwt.verify(token,JWT_SECRET_KEY,(err,payload)=>{
        if(err)
        {
            return res.status(401).json({error:"you are not logged in"})
        }

        const {_id}=payload;

        User.findById(_id)
            .then((userData)=>{
                req.user=userData
                next()
            })
            
    })
}