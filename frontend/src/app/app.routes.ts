import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'dhbw360-app';
}

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';

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
  {
    path: 'login',
    component: LoginComponent,
    title: 'DHBW360 - Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'DHBW360 - Register',
  },
  // Fallback-Route: Leitet alles Unbekannte zur Home-Seite
  {
    path: '**',
    redirectTo: ''
  }
];
