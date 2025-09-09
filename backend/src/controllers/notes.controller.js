import noteModel from "../models/note.model.js"

export async function notefind(req,res) {
    try{
         const notes = await noteModel.find({ createdBy: req.user._id }).sort({ updatedAt: -1 });
        res.json(notes);
    }catch(err){
        console.log("Notes Error",err);
        res.status(500).json({
            message:"Server Error"
        })        
    }
}

export async function noteCreate(req,res) {
    const {title, content} = req.body;

    try{
        if(!title){
            return res.status(401).json({message:"Enter Title"});
        }
        const note = await noteModel.create({
            title, content, createdBy: req.user._id
        })
        res.status(201).json({note})
    }catch(err){
         console.log("Notes Error",err);
        res.status(500).json({
            message:"Server Error"});
    }
    
}

export async function noteUpdate(req,res){
    const{title,content} = req.body

    try{

        const note = await noteModel.findById(req.params.id);

        if(!note){
            return res.status(401).json({
                message:"Not Found"
            })
        }

        if(note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(404).json({message:"Not Authorized"})
        }

        note.title = title || note.title;
        note.content = content || note.content;

        const updateNote = await note.save();
        res.json(updateNote);

    }catch(err){
        console.log("error",err);
        
    }
}

export async function noteDelet(req,res) {
    try{
        const note = await noteModel.findById(req.params.id);

        if(!note){
            return res.status(401).json({
                message:"Not Found"
            })
        }

        if(note.createdBy.toString() !== req.user._id.toString()) {
            return res.status(404).json({message:"Not Authorized"})
        }

        await note.deleteOne();
        res.status(201).json({message:"Note Deleted"})
    }catch(err){
        console.log("error",err);
        
    }
}