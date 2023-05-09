const User=require("../../../model/user");
const bcrypt=require("bcrypt");
const mailer= require("../../../mails/verifyUser");
const nodemailer = require("../../../config/nodemailer");

module.exports.create_session=async function(req,res){
   try{
        if(req.isAuthenticated()){
            req.flash("success","Sign in successfully")
            return res.redirect("/")
        }
    }
   catch(err){
        console.log(err)
    }
}
// module.exports.create_session=async function(req,res){
    // const user=await User.findOne({email:req.body.email});

    // if(user){
    //     let match=await bcrypt.compare(req.body.password,user.password);
    //     if(match){
    //         return res.redirect("/")
    //     }
    //     else{
    //         console.log("Invalid Username/password")
    //         return res.redirect("back")
    //     }
    // }
    // else{
    //     console.log("Invalid Username/password")
    //     return res.redirect("back")
    // }.
    // req.flash("success","Sign In successfully")   
    // return res.redirect("/")  
// }

module.exports.create=async function(req,res){   
    try{
        const isExist=await User.findOne({email:req.body.email});
        if(isExist){     
            req.flash("info","User already exist.")
            return res.redirect("/user/sign-in")      
        }

        if(req.body.password == req.body.confirm_password){
            let salt= bcrypt.genSaltSync(10);
            let password=bcrypt.hashSync(req.body.password,salt);

            const user=await User.create({
                name:req.body.name,
                email:req.body.email,
                password:password,
                mailTokenExpiry:new Date().getTime()+300*1000
            })
            if(user && user.isVerified==false){
                mailer.newVerificationMail(user)
                req.flash("info","Verification mail has been sent to your mail")
                return res.redirect("back")
            }
        }
        else{
            req.flash("error","Password mismatched.")
            return res.redirect("back")
        }
    }
    catch(err){
        console.log("Error while creating user :",err)
        return;
    }
}

module.exports.profile=async function(req,res){
    if(req.isAuthenticated()){
        let user= await User.findById(req.params.id);
        if(user){
            return res.render("profile",{profile_user:user});
        }
        else{
            return res.redirect("back")
        }
    }
    else{
        return res.redirect("back")
    }
}

module.exports.sign_up=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    return res.render("sign_up",{
        title:"Sign Up"
    })
}

module.exports.sign_in=function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    return res.render("sign_in",{
        title:"Sign In"
    })
}

module.exports.destroy=function(req,res){
    if(req.isAuthenticated()){
       req.logout((err)=>{
        if(err){
            console.log(err);
        }
        else{
            req.flash("success","Sign out successfully")
            return res.redirect("/user/sign-in")
        }
       })
    }
}

module.exports.verify=async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    let user=await User.findById(req.params.id)
    if(user && !user.isVerified){
        let Current_time=new Date().getTime();
        let diff= user.mailTokenExpiry - Current_time
        if(diff > 0){
            user=await User.findByIdAndUpdate(req.params.id,{$set:{isVerified:true}})
            req.flash("success","Your email is verified")
            return res.redirect("/user/sign-in")
        }
        else{
            req.flash("error","Link expired")
            return res.redirect("/user/sign-in")
        }
    }
    else{
        req.flash("error","Something went wrong")
        return res.redirect("/user/sign-in")
    }
}

module.exports.forget=async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    return res.render("forget",{
        title:"Forget Password"
    }) 
}

module.exports.forget_verify=async function(req,res){
    try{
        if(req.isAuthenticated()){
            return res.redirect("/")
        }
        let user=await User.findOne({email:req.body.email})
        if(user){
            req.flash("info","Check your mail to change password")
            mailer.Forget_VerificationMail(user)
            return res.redirect("back")
        }else{
            req.flash("error","Email is not registered")
            return res.redirect("back")
        }
    }catch(err){
        if(err){
            console.log("Error in forget user verification :",err)
            return
        }
    }
}
module.exports.change_pass=async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    let user=await User.findById(req.params.id)
    if(user){
        return res.render("change_pass",{user:user}) 
    }
    else{
        req.flash("error","Something went wrong")
        return res.redirect("/user/sign-in")
    }
}

module.exports.change_pass_verify=async function(req,res){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    let user=await User.findById(req.params.id)
    if(user){
        if(user.isVerified){
            if(req.body.password==req.body.confirm_password){
                let salt= await bcrypt.genSalt(10)
                let password = await bcrypt.hash(req.body.password,salt)
                let user =await User.findByIdAndUpdate(req.params.id,{$set:{password:password}})
                if(user){
                    req.flash("success","Password changed")   
                    return res.redirect("/user/sign-in")
                }
            }
        }
    }
    else{
        req.flash("error","Something went wrong")
        return res.redirect("/user/sign-in")
    }
}