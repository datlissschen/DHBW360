import express from 'express';
import imageRouter from "@/api/image-routes";
import gameRouter from "@/api/game-routes";

export function startExpressApp() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/img', imageRouter);
    app.use('/game', gameRouter);

    app.listen(8080, () => console.log(`Listening on port 8080`));
}