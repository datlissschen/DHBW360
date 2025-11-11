import { Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, HostListener, inject } from '@angular/core';

declare var pannellum: any;
declare var L: any;
import { FooterComponent } from '../footer/';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FooterComponent, RouterLink],
  templateUrl: './game.html',
  styleUrl: './game.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameViewComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);

  // Routen-Parameter auslesen (z.B. /game?rounds=5)
  public rounds$ = this.route.queryParamMap.pipe(
    map(params => params.get('rounds') || '1')
  );

  // Referenzen auf HTML-Elemente
  @ViewChild('panorama') panoramaEl!: ElementRef;
  @ViewChild('popupOverlay') popupOverlayEl!: ElementRef;
  @ViewChild('mapWorld') mapWorldEl!: ElementRef;
  @ViewChild('mapFloor') mapFloorEl!: ElementRef;
  @ViewChild('mapRoom') mapRoomEl!: ElementRef;

  // Referenzen auf Step-Elemente
  @ViewChild('step1') step1El!: ElementRef<HTMLDetailsElement>;
  @ViewChild('step2') step2El!: ElementRef<HTMLDetailsElement>;
  @ViewChild('step3') step3El!: ElementRef<HTMLDetailsElement>;

  // Referenzen auf Status-Elemente
  @ViewChild('status1') status1El!: ElementRef<HTMLElement>;
  @ViewChild('status2') status2El!: ElementRef<HTMLElement>;
  @ViewChild('status3') status3El!: ElementRef<HTMLElement>;

  // Component-Eigenschaften für die Logik
  private viewer: any;
  private worldMap: any;
  private floorMap: any;
  private roomMap: any;

  private selectedLocation: string | null = null;
  private selectedFloor: string | null = null;
  private selectedRoom: string | null = null;

  private lastFloorLayer: any = null;
  private lastRoomLayer: any = null;

  private osmLayer: any;
  private satelliteLayer: any;
  private defaultIcon: any;
  private activeIcon: any;
  private highlightStyle: any;
  private defaultStyle: any;

  // ngAfterViewInit wird ausgeführt, nachdem die HTML-Ansicht geladen wurde
  // (ersetzt DOMContentLoaded)
  ngAfterViewInit(): void {
    this.initPannellum();
    this.initMapStyles();
    this.initMapLogic();
  }

  // ------------------------------------------
  // TEIL 1: 360° SPIEL-ANSICHT (PANNELLUM)
  // ------------------------------------------

  private initPannellum(): void {
    this.viewer = pannellum.viewer(this.panoramaEl.nativeElement, {
      "type": "equirectangular",
      "panorama": "assets/raum.jpg", // Bild aus dem 'assets'-Ordner laden
      "autoLoad": true,
      "showControls": false,
      "draggable": true,
      "keyboardZoom": false,
      "mouseZoom": false,
      "haov": 360,
      "vaov": 80,
      "yaw": 0,
      "pitch": 10,
      "hfov": 100,
      "minPitch": -40,
      "maxPitch": 40
    });
  }

  // Click-Handler für die Navigations-Buttons
  onNavUp(): void { this.viewer.setPitch(this.viewer.getPitch() + 50); }
  onNavDown(): void { this.viewer.setPitch(this.viewer.getPitch() - 50); }
  onNavLeft(): void { this.viewer.setYaw(this.viewer.getYaw() - 50); }
  onNavRight(): void { this.viewer.setYaw(this.viewer.getYaw() + 50); }

  // Tastatur-Steuerung für die Navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowUp') this.viewer.setPitch(this.viewer.getPitch() + 50);
    else if (e.key === 'ArrowDown') this.viewer.setPitch(this.viewer.getPitch() - 50);
    else if (e.key === 'ArrowLeft') this.viewer.setYaw(this.viewer.getYaw() - 50);
    else if (e.key === 'ArrowRight') this.viewer.setYaw(this.viewer.getYaw() + 50);
  }

  // ------------------------------------------
  // TEIL 2: POPUP-LOGIK (LEAFLET)
  // ------------------------------------------

  onOpenPopup(): void {
    this.popupOverlayEl.nativeElement.style.display = 'flex';
    this.initWorldMap(); // Weltkarte initialisieren/neu laden, wenn Popup geöffnet wird
  }

  onClosePopup(): void {
    this.popupOverlayEl.nativeElement.style.display = 'none';
  }

  onSubmit(): void {
    if (!this.selectedLocation || !this.selectedFloor || !this.selectedRoom) {
      alert('Bitte wählen Sie alle drei Schritte aus.');
      return;
    }
    alert(`Auswahl:\nStandort: ${this.selectedLocation}\nEtage: ${this.selectedFloor}\nRaum: ${this.selectedRoom}`);
    this.onClosePopup();
  }

  // --- Initialisierungs-Logik für Karten ---

  private initMapStyles(): void {
    this.osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' });
    this.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' });

    this.defaultIcon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });
    this.activeIcon = L.icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
    });

    this.highlightStyle = { weight: 3, color: '#C30012', fillColor: '#930010', fillOpacity: 0.6 };
    this.defaultStyle = { weight: 2, color: '#333333', fillColor: '#777777', fillOpacity: 0.3 };
  }

  private initMapLogic(): void {
    // Event Listeners für Akkordeon-Schritte
    [this.step1El, this.step2El, this.step3El].forEach(elRef => {
      elRef.nativeElement.addEventListener('toggle', (event) => {
        const step = event.target as HTMLDetailsElement;

        if (step.classList.contains('disabled') && step.open) {
          step.open = false;
          return;
        }

        if (step.open) {
          // Alle anderen Schritte schließen
          [this.step1El, this.step2El, this.step3El].forEach(otherElRef => {
            if (otherElRef.nativeElement !== step && otherElRef.nativeElement.open) {
              otherElRef.nativeElement.open = false;
            }
          });

          // Karten initialisieren ODER Größe anpassen, wenn der Schritt geöffnet wird
          const mapId = step.querySelector('.map-container')?.id;
          if (mapId) {
            setTimeout(() => {
              if (mapId === 'map-world') this.initWorldMap();
              if (mapId === 'map-floor') this.initFloorMap();
              if (mapId === 'map-room') this.initRoomMap();
            }, 50); // 50ms Verzögerung gibt dem Akkordeon Zeit, sich zu öffnen
          }
        }
      });
    });

    // Event Listeners für Karten-Buttons (Weltkarte)
    document.querySelectorAll('.map-type-button[data-map="world"]').forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        document.querySelectorAll('.map-type-button[data-map="world"]').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');

        this.worldMap.removeLayer(this.osmLayer);
        this.worldMap.removeLayer(this.satelliteLayer);

        if (target.dataset['type'] === 'karte') this.osmLayer.addTo(this.worldMap);
        else this.satelliteLayer.addTo(this.worldMap);
      });
    });
  }

  // --- Einzelne Karten-Funktionen ---

  private initWorldMap(): void {
    if (this.worldMap) {
      this.worldMap.invalidateSize();
      return;
    }
    this.worldMap = L.map(this.mapWorldEl.nativeElement).setView([48.7758, 9.1829], 13);
    this.osmLayer.addTo(this.worldMap);

    const locations = [
      { name: "DHBW Stuttgart", lat: 48.7840, lon: 9.1738 },
      { name: "Hauptbahnhof", lat: 48.7842, lon: 9.1818 },
      { name: "Milaneo", lat: 48.7895, lon: 9.1852 },
      { name: "Schlossplatz", lat: 48.7781, lon: 9.1795 },
    ];
    let activeMarker: any = null;
    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lon], { icon: this.defaultIcon }).addTo(this.worldMap).bindPopup(loc.name);
      marker.on('click', () => {
        if (activeMarker) activeMarker.setIcon(this.defaultIcon);
        marker.setIcon(this.activeIcon);
        activeMarker = marker;

        this.selectedLocation = loc.name;
        this.updateStepStatus(this.status1El.nativeElement, `Ausgewählt: ${loc.name}`);

        this.resetStep2();
        this.resetStep3();
        this.step2El.nativeElement.classList.remove('disabled');
        this.openNextStep(this.step2El.nativeElement);
      });
    });
  }

  private initFloorMap(): void {
    if (this.floorMap) {
      this.floorMap.invalidateSize();
      return;
    }
    this.floorMap = L.map(this.mapFloorEl.nativeElement, { crs: L.CRS.Simple, minZoom: -2 });
    const w = 1000, h = 750;
    const imageUrl = 'https://via.placeholder.com/1000x750/F5F5F5/777777?text=Beispiel-Grundriss+Gebaude';
    const bounds = [[0,0], [h, w]];
    L.imageOverlay(imageUrl, bounds).addTo(this.floorMap);
    this.floorMap.fitBounds(bounds);

    const floorGeoJson = {
      "type": "FeatureCollection", "features": [
        { "type": "Feature", "properties": { "name": "Trakt A (EG)" }, "geometry": { "type": "Polygon", "coordinates": [[[50, 50], [450, 50], [450, 700], [50, 700], [50, 50]]] } },
        { "type": "Feature", "properties": { "name": "Trakt B (EG)" }, "geometry": { "type": "Polygon", "coordinates": [[[500, 50], [950, 50], [950, 700], [500, 700], [500, 50]]] } }
      ]
    };
    L.geoJSON(floorGeoJson, {
      style: this.defaultStyle,
      onEachFeature: (feature: any, layer: any) => {
        layer.on('click', () => {
          if (this.lastFloorLayer) this.lastFloorLayer.setStyle(this.defaultStyle);
          layer.setStyle(this.highlightStyle);
          this.lastFloorLayer = layer;
          this.selectedFloor = feature.properties.name;
          this.updateStepStatus(this.status2El.nativeElement, `Ausgewählt: ${this.selectedFloor}`);
          this.resetStep3();
          this.step3El.nativeElement.classList.remove('disabled');
          this.openNextStep(this.step3El.nativeElement);
        });
      }
    }).addTo(this.floorMap);
  }

  private initRoomMap(): void {
    if (this.roomMap) {
      this.roomMap.invalidateSize();
      return;
    }
    this.roomMap = L.map(this.mapRoomEl.nativeElement, { crs: L.CRS.Simple, minZoom: -2 });
    const w = 1000, h = 750;
    const imageUrl = 'https://via.placeholder.com/1000x750/F5F5F5/777777?text=Beispiel-Grundriss+Trakt+A';
    const bounds = [[0,0], [h, w]];
    L.imageOverlay(imageUrl, bounds).addTo(this.roomMap);
    this.roomMap.fitBounds(bounds);

    const roomGeoJson = {
      "type": "FeatureCollection", "features": [
        { "type": "Feature", "properties": { "name": "Raum A.101" }, "geometry": { "type": "Polygon", "coordinates": [[[50, 50], [300, 50], [300, 300], [50, 300], [50, 50]]] } },
        { "type": "Feature", "properties": { "name": "Raum A.102" }, "geometry": { "type": "Polygon", "coordinates": [[[50, 350], [300, 350], [300, 700], [50, 700], [50, 350]]] } },
        { "type": "Feature", "properties": { "name": "Flur" }, "geometry": { "type": "Polygon", "coordinates": [[[350, 50], [950, 50], [950, 700], [350, 700], [350, 50]]] } }
      ]
    };
    L.geoJSON(roomGeoJson, {
      style: this.defaultStyle,
      onEachFeature: (feature: any, layer: any) => {
        layer.on('click', () => {
          if (this.lastRoomLayer) this.lastRoomLayer.setStyle(this.defaultStyle);
          layer.setStyle(this.highlightStyle);
          this.lastRoomLayer = layer;
          this.selectedRoom = feature.properties.name;
          this.updateStepStatus(this.status3El.nativeElement, `Ausgewählt: ${this.selectedRoom}`);
        });
      }
    }).addTo(this.roomMap);
  }

  // --- Hilfsfunktionen für die Schritt-Logik ---

  private resetStep2(): void {
    this.selectedFloor = null;
    this.updateStepStatus(this.status2El.nativeElement, 'Nicht ausgewählt', false);
    this.step2El.nativeElement.classList.add('disabled');
    this.step2El.nativeElement.open = false;
    if (this.lastFloorLayer) {
      this.lastFloorLayer.setStyle(this.defaultStyle);
      this.lastFloorLayer = null;
    }
  }

  private resetStep3(): void {
    this.selectedRoom = null;
    this.updateStepStatus(this.status3El.nativeElement, 'Nicht ausgewählt', false);
    this.step3El.nativeElement.classList.add('disabled');
    this.step3El.nativeElement.open = false;
    if (this.lastRoomLayer) {
      this.lastRoomLayer.setStyle(this.defaultStyle);
      this.lastRoomLayer = null;
    }
  }

  private updateStepStatus(element: HTMLElement, text: string, addClass = true): void {
    element.textContent = text;
    if (addClass) element.classList.add('selected');
    else element.classList.remove('selected');
  }

  private openNextStep(stepElement: HTMLDetailsElement): void {
    if (stepElement) stepElement.open = true;
  }
}
