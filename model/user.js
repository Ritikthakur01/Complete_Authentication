const mongoose=require("mongoose");

//creating schema (of model,of table,of document)
const userSchema= new mongoose.Schema({
    name:{
        type:String, 
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true, //act as a primary key
    },
    password:{
        type:String,
        required:true,
        minlength:6, // setting minimum length is 6 characters
    },
    isVerified:{
        type:Boolean,  //this field is for user varification if user is not verified then user will not able to login
        default:false,
    },
    mailTokenExpiry:{
        type:Number   //this feild is for setting mail timeout
    }
},
{
    timestamps:true, //this give time of creating user
})

const User= mongoose.model("User",userSchema);  // defining model setting name of model and its schema 
module.exports=User; //exports user model