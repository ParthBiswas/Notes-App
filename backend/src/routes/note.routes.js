import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { noteCreate, noteDelet, notefind, noteUpdate } from "../controllers/notes.controller.js";

const noteRouter = express.Router();

noteRouter.post('/create',authMiddleware,noteCreate);
noteRouter.put('/update/:id',authMiddleware,noteUpdate);
noteRouter.get('/find',authMiddleware,notefind);
noteRouter.delete('/delete/:id',authMiddleware,noteDelet);

export default noteRouter;