// this index is for handleing different version in future of this project
const express= require("express");
const router = express.Router();

router.use("/",require("./v1")); 

module.exports=router;