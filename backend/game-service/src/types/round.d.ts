export interface Round {
    roundNumber: number;
    room: Room;
    floorNumber: number;
    roomImgURL: string;
    score: number | undefined;
}