const nodeMailer = require("../config/nodemailer");

module.exports.newVerificationMail =function (user) {
    let mailHTML = nodeMailer.renderTemplate({user:user}, "/verifyUser.ejs")

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