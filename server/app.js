const express=require("express");
const app=express();
const mongoose=require("mongoose");

/* mongoose connection */ 
mongoose.connect("mongodb://localhost:27017/decoder", { useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
    console.log("connected to mongoose server")
})
mongoose.connection.on('error',(err)=>{
    console.log("error connecting to server",err);
})
/* mongoose connection over */ 

/* importing schema models for user and post */
require('./schemaModels/user');     
require('./schemaModels/post');     
/* schema models imported */
 
app.use(express.json());        // need to learn the use of this statement

app.use(require('./routes/authentication'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

app.listen(5000,(req,res)=>{
    console.log("server started on port 5000")
})
