import {Component, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NgTemplateOutlet} from '@angular/common';

interface IScoreEntry {
  user_id: string;
  score: number;
}

@Component({
  selector: 'app-scoreboard',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreboardComponent implements OnInit {

  top3: IScoreEntry[] = [];
  top4to10: IScoreEntry[] = [];

  constructor(private http: HttpClient)  { }

  ngOnInit() {
    this.http.get<{topScores: IScoreEntry[]}>(`${environment.scoreServiceBaseUrl}/score/top`, {
      params: {
        min: 1,
        max: 10
      }
    }).subscribe({
      next: data => {
        const scores = data.topScores;
        console.log(scores);
        this.top3 = scores.slice(0, 3);       // Rang 1–3
        this.top4to10 = scores.slice(3, 10);  // Rang 4–10
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
