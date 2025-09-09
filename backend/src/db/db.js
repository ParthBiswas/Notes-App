import mongoose from "mongoose";
// import 'dotenv/config'

console.log("MONGO_URI:", process.env.MONGO_URL); 

export function connectDB(){
    
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Database Connected");
    }).catch(err =>{
        console.log(err);
    })
}