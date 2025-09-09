import mongoose from "mongoose";
import userModel from "./auth.model.js"

const noteSchema = new mongoose.Schema({
    title : {
        type: String,
        require: true
    },
    content : {
        type: String,
        require: true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : userModel,
        require : true
    }
},{timestamps:true});

const noteModel = mongoose.model("Notes",noteSchema);

export default noteModel;