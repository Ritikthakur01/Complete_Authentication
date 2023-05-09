const express= require("express");
const router = express.Router(); // creating router

router.use("/",require("./api")); //using api folder for version flexibility

module.exports=router;