export interface Round {
    roundNumber: number;
    room: Room;
    floorNumber: number;
    roomImgURL: string;
    correctAnswer: boolean | undefined;
    score: number | undefined;
}