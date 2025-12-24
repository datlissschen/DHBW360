import {availableRooms} from "@/room-manager";
import {Room} from "@/types/room";

export function selectRandomRooms(rounds: number) {
    const allRooms = Array.from(availableRooms.values())
    if (allRooms.length <= rounds) {
        return allRooms;
    }
    const selectedRooms: Room[] = []
    const usedIdxs: number[] = []
    for (let i = 0; i < rounds; i++) {
        let idx = -1;
        do {
            idx = Math.floor(Math.random() * allRooms.length)
        } while (usedIdxs.includes(idx));
        usedIdxs.push(idx);
        selectedRooms.push(allRooms[idx]);
    }
    return selectedRooms
}