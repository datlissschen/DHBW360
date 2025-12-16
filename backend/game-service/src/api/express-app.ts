import express from 'express';
import imageRouter from "@/api/image-routes";
import gameRouter from "@/api/game-routes";

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use('/img', imageRouter);
expressApp.use('/game', gameRouter);

export function startExpressApp() {
    const port = Number(process.env.EXPRESS_PORT || 8081);
    expressApp.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));
}

export default expressApp