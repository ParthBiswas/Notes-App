import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser()); 

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use((req, res, next) => {
 
  next();
});



// Public routes
app.use("/api/auth", userRoutes);
app.use('/api/notes',noteRouter)


export default app;
