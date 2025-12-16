import express, {Router} from "express";
import {getUserScore, setUserScore} from "@/score-manager";
import {StatusCodes} from "http-status-codes";

const scoreRouter = Router();

scoreRouter.get('/get/:userId', async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    console.log(`get score for user ${userId}`);
    const score = await getUserScore(userId);
    console.log(`score=${score}`)
    res.json({userId: userId, score: score | 0});
});

scoreRouter.post('/set', async (req: express.Request, res: express.Response) => {
    const userId = req.body.userId;
    const newScore = req.body.newScore;
    const authKey = req.body.authKey; // Only allow the other services to use this endpoint
    if (!authKey || authKey != process.env.AUTH_KEY) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }
    const success = await setUserScore(userId, newScore);
    res.json({userId: userId, success: success});
});

export default scoreRouter;