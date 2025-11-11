import fs from "node:fs";

export const available_rooms: string[] = []
export function readDownloadedImages() {
    fs.readdirSync('download/rooms').forEach(file => {
        available_rooms.push(file)
    })
}