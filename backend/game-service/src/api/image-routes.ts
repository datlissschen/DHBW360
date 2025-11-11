import express, {Router} from "express";
import {available_rooms} from "@/image-service";
import path from "path";

const imageRouter = Router();

imageRouter.get('/room/:roomId', (req: express.Request, res: express.Response) => {
    if (!available_rooms.includes(req.params.roomId)) {
        return res.status(404).send("Room not found.")
    }
    res.sendFile(path.resolve(`download/rooms/${req.params.roomId}`))
});

export default imageRouter