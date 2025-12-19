import express from 'express';
import imageRouter from "@/api/image-routes";
import gameRouter from "@/api/game-routes";
import cors from 'cors';
import geoDataRouter from "@/api/geodata-routes";
import session from 'express-session';
import dotenv from "dotenv";

dotenv.config();

declare module 'express-session' {
    interface SessionData {
        username?: string;
    }
}

const expressApp = express();

expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(cors());
expressApp.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: process.env.PRODUCTION == 'true',
        httpOnly: true,
        sameSite: process.env.PRODUCTION == 'true' ? 'none' : undefined,
        domain: process.env.PRODUCTION == 'true' ? `.${process.env.DOMAIN}` : undefined,
    },
}));
expressApp.use('/img', imageRouter);
expressApp.use('/geo-data', geoDataRouter);
expressApp.use('/game', gameRouter);

export function startExpressApp() {
    const port = Number(process.env.EXPRESS_PORT || 8081);
    expressApp.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));
}

export default expressApp