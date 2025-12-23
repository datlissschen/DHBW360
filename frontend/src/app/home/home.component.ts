import {ChangeDetectorRef, Component} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {ScoreboardComponent} from '../scoreboard/scoreboard.component';
import {AuthService} from '../auth/auth.service';
import {MatDialog} from '@angular/material/dialog';
import {InfoComponent} from '../info/info.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, FaIconComponent, ScoreboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  protected informationIcon = faCircleInfo;
  public roundsToPlay: number = 6;
  public username: string | undefined;

  constructor(private router: Router, private authService: AuthService, private cdRef: ChangeDetectorRef, public dialog: MatDialog) {
    this.authService.getUsername(localStorage.getItem('access_token') || '').then(username => {
      this.username = username;
      if (!username) {
        localStorage.removeItem("access_token");
      }
      this.cdRef.detectChanges();
    });
  }

  startGame() {
    this.router.navigate(['/game'], { queryParams: { rounds: this.roundsToPlay } });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  openInfo() {
    this.dialog.open(InfoComponent, {
      width: '600px',
    })
  }
}
