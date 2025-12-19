import express, {Router} from "express";
import path from "path";

const geoDataRouter = Router();

geoDataRouter.get('/sideview/:locationId', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`download/geo-data/${req.params.locationId}_sideview.geojson`))
});

geoDataRouter.get('/floor/:floorId', (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(`download/geo-data/${req.params.floorId}.geojson`))
});

export default geoDataRouter