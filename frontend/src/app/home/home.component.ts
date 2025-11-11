import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';
import { FormsModule } from '@angular/forms'; // <-- WICHTIG 1: Importieren

@Component({
  selector: 'app-home',
  standalone: true,
  // WICHTIG 2: Hier 'FormsModule' hinzufügen
  imports: [FooterComponent, ScoreboardComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // WICHTIG 3: Die Eigenschaft hier definieren (Standardwert 6)
  public roundsToPlay: number = 6;

  constructor(private router: Router) {}

  startGame() {
    // Navigiert zur Spiel-Seite und übergibt die Rundenanzahl
    this.router.navigate(['/game'], { queryParams: { rounds: this.roundsToPlay } });
  }
}
