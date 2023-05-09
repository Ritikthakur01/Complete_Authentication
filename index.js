const dotenv=require("dotenv") //Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
dotenv.config({path:"./config.env"}) //setting path of .env file

const env= require("./config/environment")  //importing environment.js file

const express= require("express") //importing express library file
const app=express() 
const port=env.port; //defining port number 

const expresslayout= require("express-ejs-layouts"); //requiring express-ejs-layouts for setting layout

const db= require("./config/mongoose")  //importing database connection


const MongoStore=require("connect-mongo") //this is used to store user cookies in database
const passport=require("passport"); // passport is used for authentication
const passport_Google=require("./config/passport_google") //passport-google is used for social authentication
const passport_local=require("./config/passport_local")
const passport_facebook=require("./config/passport_facebook") //passport-google is used for social authentication


const cookies =require("cookie-parser") //Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
const session=require("express-session"); //This is a Node.js module available through the npm registry.


const flash=require("connect-flash");// for showing notification
const ModifiedMware=require("./config/middleware") 


app.use(expresslayout); 
app.use(cookies())

app.set("view engine", "ejs");
app.set("views","./views");

app.set("layout extractStyles",true)
app.set("layout extractScripts",true)

// setting session
app.use(session({
    name:"Node_Auth",
    secret:env.session_cookie_key,
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60*24*30,
        httpOnly:true
    },
    store:MongoStore.create({ // storing session cookie in database
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

app.use(passport.setAuthenticatedUserforView); //calling setAuthenticatedUserforView function this function set user in locals.



app.use(flash())
app.use(ModifiedMware.setFlash);

// set assets path 
app.use(express.static(env.assets_path));

app.use(express.urlencoded()); //this is user to converting req.body and form data to json

app.use("/",require("./routes"))


// listen function used to run server at given port
app.listen(port,function(err){
    if(err){
        console.log(`Error while connecting with server : ${err}`)
        return;
    }
    console.log(`Server is running at http://localhost:${port}`)
    return;
})