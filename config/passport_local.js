const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../model/user");
const bcrypt = require("bcrypt"); // here bcrypt is used for compairing user given password with database stored encypted password

passport.use(new localStrategy({
    
    usernameField: "email",//set usernameField accordingly to database
    passwordField: "password",//set passwordField accordingly to database
    passReqToCallback: true  //pass req argument in callback function 
}, async function (req, email, password, done) {
    try {
        let user = await User.findOne({ email: email });

        if (user) {
            
            if (!user.isVerified) {//validation for verified users
                req.flash("info", "You are not a verified user, Please check your mail to verify")
                return done(null, false)
            }
            else {
                // compairing user given password with database stored encypted password
                let isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    // if verified then sign in
                    return done(null, user, { message: "Sign In successfully" });
                } else {
                    // if not verified then redirect to sign in page
                    req.flash("error", "Invalid Username/Password")
                    return done(null, false, { message: "Invalid Password" });
                }
            }
        } else {
            req.flash("error", "Invalid Username/Password")
            return done(null, false, { message: "User not found" });
        }
    }
    catch (err) {
        return console.log("this is passport auth error :", err)
    }
}))

// serializing the user to decide which key is being kept in cookies, (setting user id to identify user)
passport.serializeUser(async function (user, done) {
    done(null, user.id);
})

// deserialing the user from the key in cookies ,(getting user by its id to identify user)
passport.deserializeUser(async function (id, done) {
    try {
        let user = await User.findById(id);

        if (user) return done(null, user);

        else return done(null, false);
    }
    catch (err) {
        return done(err, false)
    }
})
// check is user authenticate or not 
passport.checkAuthentication = function (req, res, next) {
    // if user is authenticate ,next function--  pass the request to controller function
    if (req.isAuthenticated()) {
        return next();
    }
     // if the user is not signed in
    return res.redirect("/user/sign-in")
}

// set user to views
passport.setAuthenticatedUserforView = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains the current signed in user from the session cookies and we are just sends this to the locals for the views.
        res.locals.user = req.user;
    }
    next()
}
//exporting passport
module.exports = passport;