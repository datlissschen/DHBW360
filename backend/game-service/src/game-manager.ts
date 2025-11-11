import {selectRandomRoom} from "@/random-selector";

export interface Game {
    gameId: string;
    maxRounds: number;
    currentRound: number;
    imageUrl: string;
}

const games: [string, Game][] = []

export function startGame(rounds: number, userId: string): Game {
    const randomRoom = selectRandomRoom()
    const gameId = crypto.randomUUID();
    const game: Game = {
        gameId,
        maxRounds: rounds,
        currentRound: 0,
        imageUrl: `${process.env.API_BASE}/img/room/${randomRoom}`,
    };
    games.push([userId, game])
    return game;
}

