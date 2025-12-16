import { executeDBQuery } from "./database";

export class Room {
    roomId: String = ""
    locationId: string = ""
    floorNumber: number = 0
    qualifiedName: string = ""

    constructor(roomId: string, locationId: string, floorNumber: number) {
        this.roomId = roomId;
        this.locationId = locationId;
        this.floorNumber = floorNumber;
        this.qualifiedName = this.locationId + "_" + this.roomId.substring(0, 1) + this.floorNumber + "_" + this.roomId.substring(1)
    }
}

export const availableRooms: Map<string, Room> = new Map();

export async function loadAllRooms() {
    return executeDBQuery('SELECT * FROM rooms').then((rows) => {
        rows.rows.forEach((row) => {
            availableRooms.set(row.room_id.trim(), new Room(
                row.room_id.trim(),
                row.location_id.trim(),
                row.floor_number
            ))
        })
        console.log(`Loaded rooms: ${JSON.stringify(Array.from(availableRooms))}`)
        return availableRooms;
    })
}

export function getRoomById(roomId: string) {
    return availableRooms.get(roomId);
}

function getRoomQualifiedName(room: Room) {
    return
}