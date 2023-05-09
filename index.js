const dotenv=require("dotenv")
dotenv.config({path:"./config.env"})

const env= require("./config/environment")

const express= require("express")
const app=express()
const port=env.port;

const expresslayout= require("express-ejs-layouts");
const db= require("./config/mongoose")


const MongoStore=require("connect-mongo")
const passport=require("passport");
const passport_Google=require("./config/passport_google")
const passport_local=require("./config/passport_local")
const passport_facebook=require("./config/passport_facebook")


const cookies =require("cookie-parser")
const session=require("express-session");


const flash=require("connect-flash");
const ModifiedMware=require("./config/middleware")


app.use(expresslayout);
app.use(cookies())

app.set("view engine", "ejs");
app.set("views","./views");

app.set("layout extractStyles",true)
app.set("layout extractScripts",true)


app.use(session({
    name:"Node_Auth",
    secret:env.session_cookie_key,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*30,
        httpOnly:true
    },
    store:MongoStore.create({
        mongooseConnection: db, 
        touchAfter: 24 * 60 * 60,
        clearInterval: 1000 * 60 * 60 * 24,
        mongoUrl:`mongodb://127.0.0.1:27017/${env.db}`
    }, 
        function(err){
            console.log(err||"MongoStore connect successfully")
        }
    )
}))

app.use(passport.initialize());

app.use(passport.session());

app.use(passport.setAuthenticatedUserforView);



app.use(flash())
app.use(ModifiedMware.setFlash);


app.use(express.static(env.assets_path));

app.use(express.urlencoded());

app.use("/",require("./routes"))



app.listen(port,function(err){
    if(err){
        console.log(`Error while connecting with server : ${err}`)
        return;
    }
    console.log(`Server is running at http://localhost:${port}`)
    return;
})