import NodeCache from "node-cache";
import {executeDBQuery} from "@/database";

const scoreCache = new NodeCache();

export async function getTopScores(min: number, max: number) {
    const limit = max - min + 1;
    const offset = min - 1;

    const result = await executeDBQuery(
        "SELECT * FROM scores ORDER BY score DESC LIMIT $1 OFFSET $2",
        [limit, offset]
    );
    return result.rows;
}

export async function getUserScore(username: string) {
    if (scoreCache.has(username)) {
        return scoreCache.get(username);
    }
    try {
        const result = await executeDBQuery("SELECT score FROM scores WHERE username = $1", [username]);
        let score = undefined;
        if (result.rows.length > 0) {
            score = result.rows[0].score;
        }
        scoreCache.set(username, score);
        return score;
    } catch (err) {
        console.error(`Error while loading score for user ${username}:`, err);
        return undefined;
    }
}

export async function addUserScore(username: string, score: number) {
    try {
        await executeDBQuery(
                "INSERT INTO scores (username, score) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET score = scores.score + EXCLUDED.score",
                [username, score]
        );
        const currentCached: number = scoreCache.get(username) || 0;
        scoreCache.set(username, currentCached + score);
        return true;
    } catch (error) {
        console.error(`Error while saving score for user ${username}:`, error);
        scoreCache.del(username);
        return false;
    }
}