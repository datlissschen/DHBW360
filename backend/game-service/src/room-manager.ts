import 'fs';
import * as fs from "node:fs";
import path from "path";
import {fileURLToPath} from "url";

export class Room {
    roomId: string = ""
    locationId: string = ""
    floorNumber: number = 0
    floorId: string = ""
    qualifiedName: string = ""

    constructor(roomId: string, locationId: string, floorNumber: number, qualifiedName: string) {
        this.roomId = roomId;
        this.locationId = locationId;
        this.floorNumber = floorNumber;
        this.floorId = this.locationId + "_" + this.floorNumber;
        this.qualifiedName = qualifiedName;
    }
}

export const availableRooms: Map<string, Room> = new Map();

export async function loadAllRooms() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const dirPath = path.resolve(__dirname, '../download/rooms');
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            throw err;
        }
        for (let qualifiedName of files) {
            qualifiedName = qualifiedName.replace('.jpg', '');
            const locationId = qualifiedName.substring(0, qualifiedName.indexOf("_"));
            const sectionAndFloor = qualifiedName.substring(qualifiedName.indexOf("_")+1, qualifiedName.lastIndexOf('_'));
            const floorNumber = Number(sectionAndFloor.substring(1)); // Example: A3 -> 3
            const section = sectionAndFloor.substring(0,1); // Example: A3 -> A
            const roomId = section + qualifiedName.substring(qualifiedName.lastIndexOf('_')+1); // Example: A03
            availableRooms.set(roomId.trim(), new Room(
                roomId.trim(),
                locationId.trim(),
                floorNumber,
                qualifiedName
            ));
        }
        console.log(`Loaded rooms: ${JSON.stringify(Array.from(availableRooms))}`)
        return availableRooms;
    })
}

export function getRoomById(roomId: string) {
    return availableRooms.get(roomId);
}