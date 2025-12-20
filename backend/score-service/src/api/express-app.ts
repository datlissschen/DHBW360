import express from 'express';
import scoreRouter from "@/api/score-routes";
import cors from "cors";

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use('/score', scoreRouter);
expressApp.use(cors());
expressApp.use((req, res, next) => {
    console.log(req.originalUrl)
})

export async function startExpressApp() {
    const port = Number(process.env.EXPRESS_PORT || 8082);
    return new Promise<void>((resolve, reject) => {
        const server = expressApp.listen(port, '0.0.0.0', () => {
            console.log(`Listening on port ${port}`);
            console.log('Server address:', server.address());
            resolve();
        }).on('error', reject);
    });
}

export default expressApp