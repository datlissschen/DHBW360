import express, {Router} from "express";
import path from "path";

const imageRouter = Router();

imageRouter.get('/room/:roomId', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`download/rooms/${req.params.roomId}`))
});

export default imageRouter