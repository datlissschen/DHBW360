import express from 'express';
import scoreRouter from "@/api/score-routes";

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use('/score', scoreRouter);

export function startExpressApp() {
    const port = Number(process.env.EXPRESS_PORT || 8082);
    expressApp.listen(port, () => console.log(`Listening on port ${port}`));
}

export default expressApp