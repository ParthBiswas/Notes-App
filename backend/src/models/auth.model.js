import mongoose, { MongooseError } from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    dob: {type:String, required:true},
    email:{type:String,
        required:true, 
        match:[/^\S+@\S+\.\S+$/,"Please enter Valid E-mail"], 
        unique:true,
        lowercase: true}
});

const userModel = mongoose.model("User",userSchema);

export default userModel;