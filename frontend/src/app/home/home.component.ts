import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FooterComponent } from '../footer';
import { ScoreboardComponent } from '../scoreboard';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Für [(ngModel)]

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FooterComponent,
    ScoreboardComponent,
    RouterLink,
    NgOptimizedImage,
    FormsModule // Wichtig für das Input-Binding
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // Wert für das Input-Feld (Anzahl Runden)
  public rounds: number = 1;
}
