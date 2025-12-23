import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {GameComponent} from './game/game.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ImprintComponent} from './imprint/imprint.component';

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
  {
    path: 'imprint',
    component: ImprintComponent,
    title: 'DHBW360 - Impressum',
  },
  // Fallback-Route
  {
    path: '**',
    redirectTo: ''
  }
];
