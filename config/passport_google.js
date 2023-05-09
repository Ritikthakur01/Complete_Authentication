const passport =require("passport");
const GoogleStrategy= require("passport-google-oauth").OAuth2Strategy;
const bcrypt =require("bcrypt");
const env= require("./environment")

const User=require("../model/user")

passport.use(new GoogleStrategy(
    {
        clientID:env.google_clientID,
        clientSecret:env.google_clientSecret,
        callbackURL:env.google_callbackURL,
    },
    async function(accessToken,refreshToken,profile,done){
        try{
            const user =await User.findOne({email:profile.emails[0].value});
            if(user){
                return done(null,user);
            }else{
                let salt=await bcrypt.genSalt(10);
                let password=await bcrypt.hash("randomPassword",salt);

                const createUser=await User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:password,
                    isVerified:true
                })
                if(createUser){
                    return done(null,createUser);
                }
            }
        }
        catch(err){
            console.log(`Error in goggle oauth strategy ${err}`)
            return done(err,null);
        }
    }
))

module.exports=passport;