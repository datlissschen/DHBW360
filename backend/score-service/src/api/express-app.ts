import express from 'express';
import scoreRouter from "@/api/score-routes";

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use('/score', scoreRouter);
expressApp.use((req, res, next) => {
    console.log(req.originalUrl)
})

export async function startExpressApp() {
    const port = Number(process.env.EXPRESS_PORT || 8082);
    return new Promise<void>((resolve, reject) => {
        const server = expressApp.listen(port, '127.0.0.1', () => {
            console.log(`Listening on port ${port}`);
            console.log('Server address:', server.address());
            resolve();
        }).on('error', reject);
    });
}

export default expressApp