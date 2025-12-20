import express, {Router} from "express";
import {getTopScores, getUserScore, addUserScore} from "@/score-manager";
import {StatusCodes} from "http-status-codes";

const scoreRouter = Router();

scoreRouter.get('/top', async (req: express.Request, res: express.Response) => {
    const min = Number(req.query.min);
    const max = Number(req.query.max);
    console.log(`min=${min}, max=${max}`);
    let topScores = await getTopScores(min, max);
    res.json({'topScores': topScores});
});

scoreRouter.get('/get/:userId', async (req: express.Request, res: express.Response) => {
    const userId = req.params.userId;
    console.log(`get score for user ${userId}`);
    const score = await getUserScore(userId);
    console.log(`score=${score}`)
    res.json({userId: userId, score: score | 0});
});

scoreRouter.post('/add', async (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    const amount = req.body.amount;
    const authKey = req.body.authKey; // Only allow the other services to use this endpoint
    if (!authKey || authKey != process.env.AUTH_KEY) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }
    const success = await addUserScore(username, amount);
    res.json({username: username, success: success, newTotalScore: getUserScore(username)});
});

export default scoreRouter;