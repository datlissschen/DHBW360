import express, {Router} from "express";
import {addScore, calculateScore, checkAnswer, getGameByUser, saveGame, startGame, stopGame} from "@/game-manager";
import {StatusCodes} from 'http-status-codes';
import {checkLogin} from "@/user-manager";
import {Game} from "@/types/game";

const gameRouter = Router();

gameRouter.post('/start-game', async (req: express.Request, res: express.Response) => {
    if (!req.body.rounds) res.status(StatusCodes.BAD_REQUEST).json({error: 'Attribute "rounds" not found in request body'});
    const rounds = Number(req.body.rounds);
    const accessToken = req.body.accessToken;
    console.log("start-game called with rounds=" + rounds + " and accessToken=" + accessToken);
    let username: string | undefined;
    if (accessToken) {
        username = await checkLogin(accessToken);
        if (!username) {
            res.status(StatusCodes.UNAUTHORIZED).json({error: 'Access token is invalid'});
            return;
        }
    } else {
        username = crypto.randomUUID();
        req.session.randomUsername = username;
    }
    const game = await startGame(rounds, username);
    res.send({username: username, game: game});
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
    const data = await validateRequestAndGetGame(req, res);
    if (!data) { return }
    const username = data[0]
    const game = data[1]
    const correctAnswer = checkAnswer(game, selectedLocationId, selectedFloorId, selectedRoomId);
    const correctRoom = game.rounds[game.currentRoundNumber-1].room;
    const roundScore = calculateScore(correctRoom, selectedLocationId, selectedFloorId, selectedRoomId);
    game.rounds[game.currentRoundNumber-1].score = roundScore;
    let gameEnd = game.currentRoundNumber == game.maxRounds;
    game.currentRoundNumber++;
    res.json({correctAnswer: correctAnswer, gameEnd: gameEnd, game: game});
    addScore(username, roundScore);
    if (gameEnd) {
        stopGame(username);
    } else {
        saveGame(username, game);
    }
})

async function validateRequestAndGetGame(req: express.Request, res: express.Response): Promise<[string, Game] | undefined> {
    const accessToken = req.body.accessToken
    let username: string | undefined;
    if (accessToken) {
        username = await checkLogin(accessToken);
        if (!username) {
            res.status(StatusCodes.UNAUTHORIZED).json({error: 'Access token is invalid'});
            return undefined;
        }
    } else {
        username = req.session.randomUsername;
        if (!username) {
            res.status(StatusCodes.UNAUTHORIZED).json({error: 'Random username in session is undefined'});
            return undefined;
        }
    }
    const game = getGameByUser(username)
    if (!game) {
        res.status(StatusCodes.NOT_FOUND).json({
            error: `No game found with given username '${username}'`
        });
        return undefined;
    }
    return [username, game];
}

export default gameRouter;