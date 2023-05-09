const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs")
const env=require("./environment")

// Generate test SMTP service account from gmail
//create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport(env.smtp)


// defining a function which render HTML(.ejs) page for mails
const renderTemplate = function (data, relativePath) {
    let mailTemplate;
    ejs.renderFile(path.join(__dirname,"../views/mailsTemplate", relativePath),
        data,
        function (err, template) {
            if (err) {
                console.log("Not able to render template",err);
                return;
            } 
            mailTemplate = template     
        })
    return mailTemplate;
}

module.exports = {
    renderTemplate: renderTemplate,
    transporter: transporter
}
