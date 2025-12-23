import { Component } from '@angular/core';

@Component({
  selector: 'app-imprint',
  imports: [],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.css',
})
export class ImprintComponent {
  info = {
    name: 'Duale Hochschule Baden-Württemberg',
    address: 'Lerchenstraße 1',
    city: '70174 Stuttgart',
    email: 'danielziegler.1@gmx.de',
  };
}
