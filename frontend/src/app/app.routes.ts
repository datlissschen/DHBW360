import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'dhbw360-app';
}

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'DHBW360 - Home'
  },
  {
    path: 'game',
    component: GameComponent,
    title: 'DHBW360 - Spiel'
  },
  // Fallback-Route: Leitet alles Unbekannte zur Home-Seite
  {
    path: '**',
    redirectTo: ''
  }
];
