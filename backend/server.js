import app from './src/app.js';
import { connectDB } from './src/db/db.js';
import path from "path";
import 'dotenv/config'

const __dirname = path.resolve();

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "frontend","dist","index.html"));
    });
}


connectDB();


const port=process.env.PORT

app.listen(port,()=>{
    console.log("Server is Running on Port " + port)
})

