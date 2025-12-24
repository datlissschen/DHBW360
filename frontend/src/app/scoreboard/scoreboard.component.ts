import {Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NgTemplateOutlet} from '@angular/common';

interface ScoreEntry {
  username: string;
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

  top3: ScoreEntry[] = [];
  top4to10: ScoreEntry[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef)  { }

  ngOnInit() {
    this.http.get<{topScores: ScoreEntry[]}>(`${environment.scoreServiceBaseUrl}/score/top`, {
      params: {
        min: 1,
        max: 10
      }
    }).subscribe({
      next: data => {
        const scores = data.topScores;
        this.top3 = scores.slice(0, 3);       // Rang 1–3
        this.top4to10 = scores.slice(3, 10);  // Rang 4–10
        this.cdr.markForCheck();
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
