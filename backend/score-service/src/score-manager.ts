import NodeCache from "node-cache";
import {executeDBQuery} from "@/database";

const scoreCache = new NodeCache();

export async function getUserScore(userId: any) {
    if (scoreCache.has(userId)) {
        return scoreCache.get(userId);
    }
    try {
        const result = await executeDBQuery("SELECT score FROM scores WHERE user_id = $1", [userId]);
        let score = undefined;
        if (result.rows.length > 0) {
            score = result.rows[0].score;
        }
        scoreCache.set(userId, score);
        return score;
    } catch (err) {
        console.error(`Error while loading score for user ${userId}:`, err);
        return undefined;
    }
}

export async function setUserScore(userId: any, score: number) {
    try {
        await executeDBQuery(
                "INSERT INTO scores (user_id, score) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET score = $2",
                [userId, score]
        );
        scoreCache.set(userId, score);
        return true;
    } catch (error) {
        console.error(`Error while saving score for user ${userId}:`, error);
        scoreCache.del(userId);
        return false;
    }
}