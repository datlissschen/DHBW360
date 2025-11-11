import express, {Router} from "express";
import {startGame} from "@/game-manager";

const gameRouter = Router();

gameRouter.post('/start-game', async (req: express.Request, res: express.Response) => {
    const rounds = Number(req.body.rounds);
    const userId: string = req.body.userId ?? crypto.randomUUID();
    const game = startGame(rounds, userId);
    res.send({userId: userId, game: game});
})

export default gameRouter;