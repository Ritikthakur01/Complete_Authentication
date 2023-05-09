const env=require("../config/environment")
const nodeMailer = require("../config/nodemailer");

// for user email verification 
module.exports.newVerificationMail =function (user) {
    let mailHTML = nodeMailer.renderTemplate({user:user}, "/verifyUser.ejs")
    // send mail with defined transport object
    nodeMailer.transporter.sendMail({
        from: env.client_mail, //sender address
        to: user.email, //list of receivers
        subject: "Verification mail",  // Subject line
        html: mailHTML  //html body
    },(err,info)=>{
        if(err){
            console.log(err)
            return
        }
        return
    })
}

//for forget password, sending a mail to user email to change password
module.exports.Forget_VerificationMail =function (user) {
    let mailHTML = nodeMailer.renderTemplate({user:user}, "/Forget_verifyUser.ejs")

    nodeMailer.transporter.sendMail({
        from: "bhadauriaritik@gmail.com",
        to: user.email,
        subject: "Verification mail",
        html: mailHTML
    },(err,info)=>{
        if(err){
            console.log(err)
            return
        }
        return
    })
}