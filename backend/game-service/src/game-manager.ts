import {selectRandomRooms} from "@/random-selector";
import {ensureImageFile} from "@/image-service";
import {Game} from "@/types/game";
import {Round} from "@/types/round";
import {games} from './game-store';
import {Room} from "@/types/room";

export async function startGame(rounds: number, username: string): Promise<Game> {
    const randomRooms = selectRandomRooms(rounds)
    for (const room of randomRooms) {
        await ensureImageFile(`rooms/${room.qualifiedName}.jpg`);
    }
    const gameId = crypto.randomUUID();
    const roundsData: Round[] = []
    let roundNumber = 1;
    for (const room of randomRooms) {
        roundsData.push({
            roundNumber: roundNumber++,
            room: room,
            floorNumber: room.floorNumber,
            roomImgURL: `img/room/${room.qualifiedName}`,
            correctAnswer: undefined,
            score: undefined
        });
    }
    const game: Game = {
        gameId,
        maxRounds: roundsData.length,
        currentRoundNumber: 1,
        rounds: roundsData
    };
    games.set(username, game)
    return game;
}

export function getGameByUser(username: string) {
    return games.get(username);
}

export function saveGame(username: string, game: Game) {
    games.set(username, game);
}

export function stopGame(username: string) {
    games.delete(username);
}

export function addScore(username: string, amount: number) {
    fetch(`${process.env.SCORE_SERVICE_API as string}/score/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            authKey: process.env.AUTH_KEY,
            username: username,
            amount: amount,
        })
    }).then(res => res.json())
    .then(json => {
        console.log("Response from score-service: ", json);
    });
}

export function checkAnswer(game: Game, selectedLocationId: string, selectedFloorId: string, selectedRoomId: string) {
    const room = game.rounds[game.currentRoundNumber-1].room;
    const correctLocationId = room.locationId;
    const correctFloorId = room.floorId;
    const correctRoomId = game.rounds[game.currentRoundNumber-1].room.qualifiedName;
    return correctLocationId == selectedLocationId && correctFloorId == selectedFloorId && correctRoomId == selectedRoomId;
}

export function calculateScore(correctRoom: Room, selectedLocationId: string, selectedFloorId: string, selectedRoomId: string) {
    let score = 0;
    if (selectedLocationId == correctRoom.locationId) {
        score += 10;
    }
    if (selectedFloorId == correctRoom.floorId) {
        score += 20;
    }
    if (selectedRoomId == correctRoom.qualifiedName) {
        score += 40;
    }
    return score;
}
