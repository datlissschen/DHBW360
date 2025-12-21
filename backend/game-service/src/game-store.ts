import {Game} from "@/types/game";

declare global {
    var games: Map<string, Game> | undefined
}

export const games: Map<string, Game> = globalThis.games ?? new Map()
globalThis.games = games
