const express= require("express")
const router= express.Router();// creating router

const users_cnt=require("../../../controller/api/v1/user_cnt")
const passport=require("passport");


router.get("/sign-up",users_cnt.sign_up);
router.get("/sign-in",users_cnt.sign_in);
router.post("/create",users_cnt.create);

router.get("/forget",users_cnt.forget);

router.post("/forget-verify",users_cnt.forget_verify);

router.get("/change-pass/:id",users_cnt.change_pass);
router.post("/change-pass-verify/:id",users_cnt.change_pass_verify);

// use passport as a middleware to authenticate, passport.checkAuthentication will check if user is authenticate ,next function--  pass the request to controller function.
router.get("/profile/:id",passport.checkAuthentication,users_cnt.profile)

//passport.authenticate will call passport-local strategy. on failure will redirect to sign-in page
router.post("/create-session",passport.authenticate("local",{
    failureRedirect:"/user/sign-in",
}),users_cnt.create_session)

router.get("/sign-out",passport.checkAuthentication,users_cnt.destroy);

//on hitting to this url google oauth will call, 
router.get("/auth/google",passport.authenticate("google",{
    scope:["profile","email"]
}))
//on this url google sends user detail 
router.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:"/user/sign-in"}),users_cnt.create_session)

//on hitting to this url facebook auth will call,
router.get("/auth/facebook",passport.authenticate("facebook"))
//on this url google sends user detail 
router.get("/auth/facebook/callback",passport.authenticate("facebook",{failureRedirect:"/user/sign-in"}),users_cnt.create_session)

router.get("/verify/:id",users_cnt.verify)

module.exports= router;