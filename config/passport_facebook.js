const passport =require("passport");
const FacebookStrategy= require("passport-facebook").Strategy;
const bcrypt =require("bcrypt"); //for creating random passwords
const env=require("./environment") //importing environment.js file to set value at needed placed

const User=require("../model/user")

passport.use(new FacebookStrategy(
    {   
        //options which will contain client facebook developer details
        clientID:env.facebook_clientID,
        clientSecret:env.facebook_clientSecret,
        callbackURL:env.facebook_callbackURL,
        profileFields:["id","displayName","emails","photos"]
    },
    async function(accessToken,refreshToken,profile,done){
        try{
            const user =await User.findOne({email:profile.emails[0].value});
            // if user exist user will sign-in, if not then user will create in database and then sign-in
            if(user){
                return done(null,user);
            }else{
                //creating a random password
                let salt=await bcrypt.genSalt(10);
                let password=await bcrypt.hash("randomPassword",salt);
                
                //creating user, if user doesn't exit
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
//exporting passport
module.exports=passport;