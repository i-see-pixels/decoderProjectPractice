const mongoose=require("mongoose");
const {ObjectId}=mongoose.Schema.Types;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:false,
        default:"https://res.cloudinary.com/vikash0901/image/upload/v1603793841/ic_account_circle_48px-512_lhs7qf.png"
    },
    forkedPost:[
        {
            type:ObjectId,
            ref:"Post"
        }
    ]
});

mongoose.model("User",userSchema);

