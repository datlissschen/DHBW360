import supertestSession from 'supertest-session';
import {beforeAll, afterAll, describe, expect, it} from 'vitest';
import expressApp from '../api/express-app';
import {loadAllRooms} from "@/room-manager";
import dotenv from 'dotenv';
import {downloadAllFiles} from "@/s3";
import nock from 'nock';
import {getUserScore} from "../../../score-service/src/score-manager";

dotenv.config({path: `./game-service/.env`});

let session: any;
let gameId: string | undefined;
let totalScore: number = 0;
let username: string | undefined;
let maxRounds: number | undefined;
let currentRoundNumber: number | undefined;

beforeAll(async () => {
    // Simulating network requests to other services with nock
    nock.disableNetConnect();
    nock.enableNetConnect((host) => {
        return host.includes('127.0.0.1') || host.includes('localhost') || host.includes('amazonaws.com');
    });

    session = supertestSession(expressApp);
    await downloadAllFiles()
    await loadAllRooms()
    gameId = undefined;
    maxRounds = undefined;
    currentRoundNumber = undefined;
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

    // 401 because no username is set in the session before starting a game
    it('should submit an answer without a game session and fail with 401 UNAUTHORIZED', async () => {
        session = supertestSession(expressApp);
        const postData = {
            selectedLocationId: "LE1",
            selectedFloorId: "LE2_2",
            selectedRoomId: "Z1",
        }
        const response = await httpPost(session, '/game/check-answer', '', postData);
        expect(response.status).toBe(401);
    })

    it('should simulate a game session without login', async () => {
        const scope = nock('http://127.0.0.1:8082')
            .persist()
            .post('/score/add', () => true)
            .reply(200, (uri, requestBody) => {
                const body = requestBody as any;
                console.log('Intercepted Body:', requestBody);
                totalScore += body.amount;
                return {
                    username: username,
                    success: true,
                    newTotalScore: totalScore
                };
            });
        session = supertestSession(expressApp);

        // Start a new game without login and 2 rounds
        const rounds = 2;
        let postData = {
            rounds: rounds,
        };
        let response = await httpPost(session, '/game/start-game', '', postData);
        expect(response.status).toBe(200);
        expect(response.body.username).toBeDefined();
        expect(response.body.game).toBeDefined();
        expect(response.body.game.gameId).toBeDefined();
        expect(response.body.game.maxRounds).toEqual(rounds);
        expect(response.body.game.currentRoundNumber).toEqual(1);
        expect(response.body.game.rounds.length).toEqual(rounds);
        username = response.body.username;
        gameId = response.body.game.gameId;
        maxRounds = response.body.game.maxRounds;
        currentRoundNumber = response.body.game.currentRoundNumber;

        // Submit an incorrect answer
        let postData2 = {
            selectedLocationId: "LE1",
            selectedFloorId: "LE2_2",
            selectedRoomId: "Z1",
        }
        response = await httpPost(session, '/game/check-answer', '', postData2);
        expect(response.status).toBe(200);
        expect(response.body.correctAnswer).toBeFalsy()
        checkGameReponse(response);
        let nextRound = response.body.game.rounds[currentRoundNumber!-1];
        let correctNextAnswer: { locationId: string, floorId: string, roomId: string } =
            {
                locationId: nextRound.room.locationId,
                floorId: nextRound.room.floorId,
                roomId: nextRound.room.qualifiedName,
            };

        // Submit a correct answer
        let postData3 = {
            selectedLocationId: correctNextAnswer!.locationId,
            selectedFloorId: correctNextAnswer!.floorId,
            selectedRoomId: correctNextAnswer!.roomId
        }
        response = await httpPost(session, '/game/check-answer', '', postData3);
        expect(response.status).toBe(200);
        expect(response.body.correctAnswer).toBeTruthy()
        checkGameReponse(response);

        expect(scope.isDone()).toBe(true);
    });

    function checkGameReponse(response: any) {
        expect(response.body.gameEnd).toBeDefined()
        expect(response.body.game).toBeDefined()
        expect(response.body.game.gameId).toEqual(gameId)
        expect(response.body.game.maxRounds).toEqual(maxRounds)
        expect(response.body.game.currentRoundNumber).toEqual(currentRoundNumber!+1)
        currentRoundNumber!++
    }
});

afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});