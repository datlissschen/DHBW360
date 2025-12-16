import {selectRandomRooms} from "@/random-selector";
import {ensureImageFile} from "@/image-service";
import {getRoomById, Room} from "./room-manager";

export interface Game {
    gameId: string;
    maxRounds: number;
    currentRoundNumber: number;
    rounds: Round[];
}

export interface Round {
    roundNumber: number;
    room: Room;
    floorNumber: number;
    roomImgURL: string;
    score: number | undefined;
}

// Map<UserId, Game>
const games: Map<any, Game> = new Map()

export async function startGame(rounds: number, userId: string): Promise<Game> {
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
            roomImgURL: `rooms/${room.qualifiedName}.jpg`,
            score: undefined
        });
    }
    const game: Game = {
        gameId,
        maxRounds: roundsData.length,
        currentRoundNumber: 1,
        rounds: roundsData
    };
    games.set(userId, game)
    return game;
}

export function getGameByUserId(userId: any) {
    return games.get(userId);
}

export function saveGame(userId: any, game: Game) {
    games.set(userId, game);
}

export function stopGame(userId: any) {
    games.delete(userId);
}

export function checkAnswer(game: Game, selectedLocationId: string, selectedFloorId: string, selectedRoomId: string) {
    const room = game.rounds[game.currentRoundNumber-1].room;
    const correctLocationId = room.locationId;
    const correctFloorId = room.floorId;
    const correctRoomId = game.rounds[game.currentRoundNumber-1].room.roomId;
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
    if (selectedRoomId == correctRoom.roomId) {
        score += 40;
    }
    return score;
}
