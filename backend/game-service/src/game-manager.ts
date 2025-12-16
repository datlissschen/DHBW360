import {selectRandomRooms} from "@/random-selector";
import {ensureImageFile} from "@/image-service";

export interface Game {
    gameId: string;
    maxRounds: number;
    currentRound: number;
    roomIds: string[];
    imageURLs: string[];
}

// Map<UserId, Game>
const games: Map<any, Game> = new Map()

export async function startGame(rounds: number, userId: string): Promise<Game> {
    const randomRooms = selectRandomRooms(rounds)
    for (const room of randomRooms) {
        await ensureImageFile(`rooms/${room.qualifiedName}.jpg`);
    }
    const gameId = crypto.randomUUID();
    const game: Game = {
        gameId,
        maxRounds: randomRooms.length,
        currentRound: 1,
        roomIds: randomRooms.map(room => {
            return room.qualifiedName
        }),
        imageURLs: randomRooms.map(room => {
            return `${process.env.API_BASE}/img/room/${room.qualifiedName}.jpg`
        }),
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

export function checkAnswer(game: Game, selectedRoomId: string) {
    const correctRoomId = game.roomIds[game.currentRound-1]
    return selectedRoomId == correctRoomId
}

