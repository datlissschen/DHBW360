import {available_rooms} from "@/image-service";

export function selectRandomRoom() {
    const idx = Math.floor(Math.random() * 100 / available_rooms.length)
    return available_rooms[idx]
}