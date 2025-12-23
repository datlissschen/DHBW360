import {Round} from "@/game-manager";

export interface Game {
    gameId: string;
    maxRounds: number;
    currentRoundNumber: number;
    rounds: Round[];
}