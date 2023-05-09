const express= require("express")
const router= express.Router();

const users_cnt=require("../../../controller/api/v1/user_cnt")
const passport=require("passport");


router.get("/sign-up",users_cnt.sign_up);
router.get("/sign-in",users_cnt.sign_in);
router.post("/create",users_cnt.create);

router.get("/forget",users_cnt.forget);

router.post("/forget-verify",users_cnt.forget_verify);

router.get("/change-pass/:id",users_cnt.change_pass);
router.post("/change-pass-verify/:id",users_cnt.change_pass_verify);

router.get("/profile/:id",passport.checkAuthentication,users_cnt.profile)

router.post("/create-session",passport.authenticate("local",{
    failureRedirect:"/user/sign-in",
}),users_cnt.create_session)

router.get("/sign-out",passport.checkAuthentication,users_cnt.destroy);

router.get("/auth/google",passport.authenticate("google",{
    scope:["profile","email"]
}))

router.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:"/user/sign-in"}),users_cnt.create_session)

router.get("/auth/facebook",passport.authenticate("facebook"))

router.get("/auth/facebook/callback",passport.authenticate("facebook",{failureRedirect:"/user/sign-in"}),users_cnt.create_session)

router.get("/verify/:id",users_cnt.verify)

module.exports= router;