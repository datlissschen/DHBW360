import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { FormsModule } from '@angular/forms';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ScoreboardComponent, FormsModule, FaIconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  protected informationIcon = faCircleInfo;
  public roundsToPlay: number = 6;

  constructor(private router: Router) {}

  startGame() {
    this.router.navigate(['/game'], { queryParams: { rounds: this.roundsToPlay } });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
