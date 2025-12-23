import {Component, Inject, Input} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";

interface Round {
  number: number;
  correctAnswer: boolean;
  score: number;
}

@Component({
  selector: 'app-round-result',
    imports: [
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle
    ],
  templateUrl: './round-result.html',
  styleUrl: './round-result.css',
})
export class RoundResult {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    correctAnswer: boolean,
    pointsEarned: number,
    gameEnd: boolean,
    roundResults: Round[]
  }) {}
}
