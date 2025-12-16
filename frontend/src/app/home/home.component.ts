import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScoreboardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public roundsToPlay: number = 6;

  constructor(private router: Router) {}

  startGame() {
    this.router.navigate(['/game'], { queryParams: { rounds: this.roundsToPlay } });
  }
}
