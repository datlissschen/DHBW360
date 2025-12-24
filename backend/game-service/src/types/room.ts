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