import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser()); 

const allowedOrigins = [
  "http://localhost:5173",                
  "https://notes-app-unnu.onrender.com"   
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
 
  next();
});



// Public routes
app.use("/api/auth", userRoutes);
app.use('/api/notes',noteRouter)


export default app;
