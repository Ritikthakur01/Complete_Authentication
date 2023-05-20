# Complete_Authentication
This project has complete Authentication system.
<br/>
<br/>
![ezgif com-video-to-gif](https://github.com/Ritikthakur01/Complete_Authentication/assets/114640486/c686b5ca-c9bf-4c8b-b17a-4ca69210dfb5)


## Features of this projects are 🚱
1. Sign up with email (Validation- user have to verify email, a verification mail will sent to provided email)

2. Sign in (redirect to a blank home page with a sign out and profile button after sign in)

3. Sign out
4. Forgot password (send a reset password link which expires in next 5 mintues)

5. The password stored in the db should be encrypted
6. Google login/signup (by using username and app password(2fa)) (Social authentication)
7. Facebook login/signup (Social authentication)
8. Display all needed notifications in a beautified manner
9. Version Flexibility (if a user use older version and new version is rolled out user will not forced to upgrade on new version)

## How to setup the project on local system 🚱
lets understand steps of using this project in local system -

1. Do npm install to get node-module.
2. Do npm init to set project config accordingly.
3. Put values of all variables that are shown in enviroment.js,  You have to make your own config.env file and store all related varibles with its values init. or you can store values of varibles in enviroment varibles.(set value of production object if you run this in production mode).
4. To run project in developer mode type "npm run dev (through nodemon) or npm start".
5. To run project in production mode type "npm run prod_start". (make sure you put all value of production varibles that are in config.env file)

## Additional 🦖
- Animated UI
- Well commented code
- Scaleable folder structure (separate models, controllers and routes)
- Pages look good! Refer to Google/facebook/other authentication systems
- Hides all data that is needed to be hidden while push on github (stores in .env file)     
