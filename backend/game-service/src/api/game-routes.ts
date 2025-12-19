import express, {Router} from "express";
import {
    addScore,
    calculateScore,
    checkAnswer,
    Game,
    getGameByUser,
    saveGame,
    startGame,
    stopGame
} from "@/game-manager";
import {StatusCodes} from 'http-status-codes';

const gameRouter = Router();

gameRouter.post('/start-game', async (req: express.Request, res: express.Response) => {
    if (!req.body.rounds) res.status(StatusCodes.BAD_REQUEST).json({error: 'Attribute "rounds" not found in request body'});
    const rounds = Number(req.body.rounds);
    const username: string = req.body.username ?? crypto.randomUUID();
    const game = await startGame(rounds, username);
    req.session.username = username;
    res.send({username: username, game: game});
})

gameRouter.get('/test/correct-answer', async (req: express.Request, res: express.Response) => {
    if (process.env.PRODUCTION === "true") {
        res.status(StatusCodes.NOT_IMPLEMENTED).json({
            error: "This endpoint is not enabled in production"
        });
        return;
    }
    const username = req.session.username!;
    const game = getGameByUser(username)!;
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
    const username = data[0]
    const game = data[1]
    const correctAnswer = checkAnswer(game, selectedLocationId, selectedFloorId, selectedRoomId);
    const correctRoom = game.rounds[game.currentRoundNumber-1].room;
    const roundScore = calculateScore(correctRoom, selectedLocationId, selectedFloorId, selectedRoomId);
    game.rounds[game.currentRoundNumber-1].score = roundScore;
    saveGame(username, game);
    //const {rounds, ...gameWithoutRounds} = game;
    //gameWithoutRounds.currentRoundNumber++
    game.currentRoundNumber++;
    res.json({correctAnswer: correctAnswer, gameEnd: game.currentRoundNumber-1 == game.maxRounds, game: game});
    if (game.currentRoundNumber == game.maxRounds) {
        stopGame(username)
    } else {
        game.currentRoundNumber++;
        saveGame(username, game);
        addScore(username, roundScore);
    }
})

function checkRequest(req: express.Request, res: express.Response): [string, Game] | undefined {
    const username = req.session.username;
    if (!username) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return undefined;
    }
    const game = getGameByUser(username)
    if (!game) {
        res.status(StatusCodes.NOT_FOUND).json({
            error: "No game found with given user id"
        });
        return undefined;
    }
    return [username, game];
}

export default gameRouter;