import express, {Router} from "express";
import {checkAnswer, Game, getGameByUserId, saveGame, startGame, stopGame} from "@/game-manager";
import {StatusCodes} from 'http-status-codes';

const gameRouter = Router();

gameRouter.post('/start-game', async (req: express.Request, res: express.Response) => {
    const rounds = Number(req.body.rounds);
    const userId: string = req.body.userId ?? crypto.randomUUID();
    const game = await startGame(rounds, userId);
    res.send({userId: userId, game: game});
})

gameRouter.post('/check-answer', async (req: express.Request, res: express.Response) => {
    const selectedRoomId = req.body.selectedRoomId;
    if (!selectedRoomId) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: "No room id given"
        });
        return;
    }
    const data = checkRequest(req, res)
    if (!data) { return }
    const userId = data[0]
    const game = data[1]
    const correctAnswer = checkAnswer(game, selectedRoomId);
    res.json({correctAnswer: correctAnswer, gameEnd: game.currentRound == game.maxRounds, game: game});
    if (game.currentRound == game.maxRounds) {
        stopGame(userId)
    } else {
        game.currentRound++;
        saveGame(userId, game)
    }
})

function checkRequest(req: express.Request, res: express.Response): [any, Game] | undefined {
    const userId = req.body.userId;
    if (!userId) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return undefined;
    }
    const game = getGameByUserId(userId)
    if (!game) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: "No game found with given user id"
        });
        return undefined;
    }
    return [userId, game];
}

export default gameRouter;