const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../model/user");
const bcrypt = require("bcrypt");

passport.use(new localStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
}, async function (req, email, password, done) {
    try {
        let user = await User.findOne({ email: email });

        if (user) {
            if (!user.isVerified) {
                req.flash("info", "You are not a verified user, Please check your mail to verify")
                return done(null, false)
            }
            else {
                let isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {

                    return done(null, user, { message: "Sign In successfully" });
                } else {
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

passport.serializeUser(async function (user, done) {
    done(null, user.id);
})

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

passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/user/sign-in")
}

passport.setAuthenticatedUserforView = function (req, res, next) {
    if (req.isAuthenticated()) {
        //req.user contains the current signed in user from the session cookies and we are just sends this to the locals for the views.
        res.locals.user = req.user;
    }
    next()
}

module.exports = passport;