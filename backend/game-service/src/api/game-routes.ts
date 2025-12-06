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

gameRouter.get('/test/correct-answer', async (req: express.Request, res: express.Response) => {
    if (process.env.PRODUCTION === "true") {
        res.status(StatusCodes.NOT_IMPLEMENTED).json({
            error: "This endpoint is not enabled in production"
        });
        return;
    }
    const userId = req.body.userId
    const game = getGameByUserId(userId)!;
    const room = game.rounds[game.currentRoundNumber-1].room
    const correctAnswer = {
        locationId: room.locationId,
        floorId: room.floorId,
        roomId: room.roomId,
    }
    res.json({correctAnswer: correctAnswer});
})

gameRouter.post('/check-answer', async (req: express.Request, res: express.Response) => {
    const selectedLocationId = req.body.selectedLocationId;
    const selectedFloorId = req.body.selectedFloorId;
    const selectedRoomId = req.body.selectedRoomId;
    if (!selectedLocationId || !selectedFloorId || !selectedRoomId) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: "No location, floor or room id given"
        });
        return;
    }
    const data = checkRequest(req, res)
    if (!data) { return }
    const userId = data[0]
    const game = data[1]
    const correctAnswer = checkAnswer(game, selectedLocationId, selectedFloorId, selectedRoomId);
    const {rounds, ...gameWithoutRounds} = game;
    gameWithoutRounds.currentRoundNumber++
    res.json({correctAnswer: correctAnswer, gameEnd: game.currentRoundNumber == game.maxRounds, game: gameWithoutRounds});
    if (game.currentRoundNumber == game.maxRounds) {
        stopGame(userId)
    } else {
        game.currentRoundNumber++;
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