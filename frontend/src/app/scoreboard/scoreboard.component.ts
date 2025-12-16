import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardComponent {}
