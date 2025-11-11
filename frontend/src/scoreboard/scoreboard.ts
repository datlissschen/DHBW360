import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard.html',
  styleUrl: './scoreboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardComponent {}
