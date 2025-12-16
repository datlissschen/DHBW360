import express, {Router} from "express";
import path from "path";

const imageRouter = Router();

imageRouter.get('/room/:roomId', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`download/rooms/${req.params.roomId}.jpg`))
});

imageRouter.get('/floor/:floorId', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`download/floor-plans/${req.params.floorId}.png`))
});

imageRouter.get('/geo-data/:floorId', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`download/geo-data/${req.params.floorId}.geojson`))
});


export default imageRouter