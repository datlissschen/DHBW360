import supertestSession from 'supertest-session';
import {beforeAll, beforeEach, describe, expect, it} from 'vitest';
import expressApp from '../api/express-app';
import {initDatabase} from "@/database";
import {loadAllRooms} from "@/room-manager";
import dotenv from 'dotenv';

dotenv.config({path: `./game-service/.env`});


let session: any;
let userId: string | undefined;
let gameId: string | undefined;
let maxRounds: number | undefined;
let currentRoundNumber: number | undefined;
let correctNextAnswer: { locationId: string, floorId: string, roomId: string } | undefined;

beforeAll(async () => {
    session = supertestSession(expressApp);
    await initDatabase()
    //await downloadAllFiles()
    await loadAllRooms()
    userId = undefined;
    gameId = undefined;
    maxRounds = undefined;
    currentRoundNumber = undefined;
    correctNextAnswer = undefined;
})

async function httpPost(session: any, endpoint: string, csrfToken: string, data = {}) {
    return session
            .post(endpoint)
            .set('Content-Type', 'application/json')
            .set('X-CSRF-TOKEN', csrfToken)
            .send(data);
}

async function httpGet(session: any, endpoint: string, csrfToken: string, data = {}) {
    return session
            .get(endpoint)
            .set('Content-Type', 'application/json')
            .set('X-CSRF-TOKEN', csrfToken)
            .send(data);
}

describe('Test game workflow', () => {

    beforeEach(async () => {
        session = supertestSession(expressApp);
    });

    it('should submit an answer without a game session and without authentication and fail with 401 UNAUTHORIZED', async () => {
        const postData = {
            selectedLocationId: "LE1",
            selectedFloorId: "LE2_2",
            selectedRoomId: "Z1",
            userId: userId,
        }
        const response = await httpPost(session, '/game/check-answer', '', postData);
        expect(response.status).toBe(401);
    })

    it('should start a new game without authentication and 2 rounds', async () => {
        const rounds = 2;
        const postData = {
            rounds: rounds,
        };
        const response = await httpPost(session, '/game/start-game', '', postData);
        expect(response.status).toBe(200);
        expect(response.body.userId).toBeDefined();
        expect(response.body.game).toBeDefined();
        expect(response.body.game.gameId).toBeDefined();
        expect(response.body.game.maxRounds).toEqual(rounds);
        expect(response.body.game.currentRoundNumber).toEqual(1);
        expect(response.body.game.rounds.length).toEqual(rounds);
        userId = response.body.userId;
        gameId = response.body.game.gameId;
        maxRounds = response.body.game.maxRounds;
        currentRoundNumber = response.body.game.currentRoundNumber;
    });

    it('should submit an incorrect answer', async () => {
        const postData = {
            selectedLocationId: "LE1",
            selectedFloorId: "LE2_2",
            selectedRoomId: "Z1",
            userId: userId,
        }
        const response = await httpPost(session, '/game/check-answer', '', postData);
        expect(response.status).toBe(200);
        expect(response.body.correctAnswer).toBeFalsy()
        checkGameReponse(response);
    })

    it('should GET the correct answer for the next round', async () => {
        const response = await httpGet(session, '/game/test/correct-answer', '', {userId: userId});
        console.log(response.body);
        expect(response.status).toBe(200)
        expect(response.body.correctAnswer).toBeDefined()
        correctNextAnswer = response.body.correctAnswer;
    })

    it('should submit a correct answer', async () => {
        const postData = {
            selectedLocationId: correctNextAnswer!.locationId,
            selectedFloorId: correctNextAnswer!.floorId,
            selectedRoomId: correctNextAnswer!.roomId,
            userId: userId,
        }
        const response = await httpPost(session, '/game/check-answer', '', postData);
        expect(response.status).toBe(200);
        expect(response.body.correctAnswer).toBeTruthy()
        checkGameReponse(response);
    })

    function checkGameReponse( response: any) {
        expect(response.body.gameEnd).toBeDefined()
        expect(response.body.game).toBeDefined()
        expect(response.body.game.gameId).toEqual(gameId)
        expect(response.body.game.maxRounds).toEqual(maxRounds)
        expect(response.body.game.currentRoundNumber).toEqual(currentRoundNumber!+1)
        currentRoundNumber!++
    }
});