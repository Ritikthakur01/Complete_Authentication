const mongoose= require("mongoose");
const env=require("./environment")

async function main(){
    await mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`)
    return;
}

main().then(function(data){
    console.log("Connected to MongoDB");
    return;
}).catch(function(err){
    console.log("Error on connecting with MongoDB:",err);
    return;
})
