import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from './footer/footer.component';

@Component({
  selector: 'app-root',
  //imports: [RouterOutlet],
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    FooterComponent
  ],
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}

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
