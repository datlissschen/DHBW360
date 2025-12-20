import express from 'express';
import imageRouter from "@/api/image-routes";
import gameRouter from "@/api/game-routes";
import cors from 'cors';
import geoDataRouter from "@/api/geodata-routes";
import session from 'express-session';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

declare module 'express-session' {
    interface SessionData {
        randomUsername?: string;
    }
}

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cors());
console.log(process.env.SESSION_SECRET)
expressApp.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: false,//process.env.PRODUCTION == 'true',
        httpOnly: true,
        sameSite: process.env.PRODUCTION == 'true' ? 'none' : undefined,
        domain: process.env.PRODUCTION == 'true' ? `.${process.env.DOMAIN}` : undefined,
    },
}))
expressApp.use('/img', imageRouter);
expressApp.use('/geo-data', geoDataRouter);
expressApp.use('/game', gameRouter);

expressApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('EXPRESS ERROR:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

export function startExpressApp() {
    const port = Number(process.env.EXPRESS_PORT || 8081);
    return new Promise<void>((resolve, reject) => {
        const server = expressApp.listen(port, '0.0.0.0', () => {
            console.log(`Listening on port ${port}`);
            console.log('Server address:', server.address());
            resolve();
        }).on('error', reject);
    });
}

export default expressApp