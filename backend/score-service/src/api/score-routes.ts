import express, {Router} from "express";
import {getTopScores, getUserScore, addUserScore} from "@/score-manager";
import {StatusCodes} from "http-status-codes";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isUuid = (value: unknown): value is string => typeof value === "string" && UUID_REGEX.test(value);

const scoreRouter = Router();

scoreRouter.get('/top', async (req: express.Request, res: express.Response) => {
    const min = Number(req.query.min);
    const max = Number(req.query.max);
    let topScores = await getTopScores(min, max);
    res.json({'topScores': topScores});
});

scoreRouter.get('/get/:username', async (req: express.Request, res: express.Response) => {
    const username = req.params.username;
    console.log(`get score for user ${username}`);
    const score = await getUserScore(username);
    console.log(`score=${score}`)
    res.json({username: username, score: score | 0});
});

scoreRouter.post('/add', async (req: express.Request, res: express.Response) => {
    const username = req.body.username;
    const amount = req.body.amount;
    const authKey = req.body.authKey; // Only allow the other services to use this endpoint, not users directly
    if (!username || !amount || !authKey) {
        res.status(StatusCodes.BAD_REQUEST).json({error: 'Missing parameters'});
        return;
    }
    console.log(`add ${amount} points to user ${username} with authKey ${authKey}`);
    if (!authKey || authKey != process.env.AUTH_KEY) {
        res.status(StatusCodes.UNAUTHORIZED).json({error: 'Not authorized to use this endpoint'});
        return;
    }
    if (isUuid(username)) {
        res.json({error: 'Not adding score to UUID usernames'});
        return;
    }
    const success = await addUserScore(username, amount);
    res.json({username: username, success: success, newTotalScore: getUserScore(username)});
});

export default scoreRouter;