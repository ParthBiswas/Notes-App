import mongoose from "mongoose";
// import 'dotenv/config'



export function connectDB(){
    
    mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Database Connected");
    }).catch(err =>{
        console.log(err);
    })
}