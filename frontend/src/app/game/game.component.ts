import {
  Component, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy, HostListener,
  ChangeDetectorRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { GeoJSON } from 'leaflet';
import {AuthService} from '../auth/auth.service';
import {RoundResult} from '../round-result/round-result';
import {MatDialog} from '@angular/material/dialog';

interface IGameStartResponse {
  game: IGame;
}

interface IGame {
  rounds: {
    correctAnswer: boolean;
    roomImgURL: string;
    score: number;
  }[],
  currentRoundNumber: number;
  maxRounds: number;
}

declare var pannellum: any;
declare var L: any;

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, RoundResult],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements AfterViewInit {

  currentRound: number = 1;
  maxRounds: number = 1;
  cumulativeScore: number = 0
  username: string | undefined;
  locationNotAvailable: boolean = false;

  @ViewChild('panorama') panoramaEl!: ElementRef;
  @ViewChild('popupOverlay') popupOverlayEl!: ElementRef;
  @ViewChild('mapWorld') mapWorldEl!: ElementRef;
  @ViewChild('mapFloor') mapFloorEl!: ElementRef;
  @ViewChild('mapRoom') mapRoomEl!: ElementRef;

  @ViewChild('step1') step1El!: ElementRef<HTMLDetailsElement>;
  @ViewChild('step2') step2El!: ElementRef<HTMLDetailsElement>;
  @ViewChild('step3') step3El!: ElementRef<HTMLDetailsElement>;

  @ViewChild('status1') status1El!: ElementRef<HTMLElement>;
  @ViewChild('status2') status2El!: ElementRef<HTMLElement>;
  @ViewChild('status3') status3El!: ElementRef<HTMLElement>;

  private viewer: any;
  private worldMap: any;
  private floorMap: any;
  private roomMap: any;

  private selectedLocation: string | null = null;
  private selectedLocationId: string | null = null;
  private selectedFloor: string | null = null;
  private selectedRoom: string | null = null;

  private floorImageLayer?: any;
  private floorGeoLayer?: any;
  private lastFloorLayer: any = null;
  private lastRoomLayer: any = null;

  private osmLayer: any;
  private satelliteLayer: any;
  private defaultIcon: any;
  private activeIcon: any;
  private highlightStyle: any;
  private defaultStyle: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef,
    private roundResultDialog: MatDialog
  ) {
    this.authService.getUsername(localStorage.getItem('access_token') || '').then(username => {
      this.username = username;
      if (!username) {
        localStorage.removeItem("access_token");
      }
      this.cdRef.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.initMapStyles();
    this.initMapLogic();
    this.requestGameResources();
  }

  private requestGameResources(): void {
    this.route.queryParamMap.pipe(
      map(params => Number(params.get('rounds')) || 1)
    ).subscribe(rounds => {
      this.http.post<IGameStartResponse>(`${environment.gameServiceBaseUrl}/game/start-game`, {
        accessToken: localStorage.getItem('access_token'),
        rounds: rounds,
      }, {withCredentials: true}).subscribe({
        next: data => {
          this.currentRound = data.game.currentRoundNumber;
          this.maxRounds = data.game.maxRounds;
          this.initPannellum(data.game.rounds[0].roomImgURL);
          this.cdRef.markForCheck();
        },
        error: err => {
          if (err.status == 401) {
            this.router.navigate(["/login"]);
          }
        }
      });
    });
  }

  private initPannellum(roomImageUrl: string): void {
    if (this.viewer) {
      this.viewer.destroy();
    }
    this.viewer = pannellum.viewer(this.panoramaEl.nativeElement, {
      "type": "equirectangular",
      "panorama": `${environment.gameServiceBaseUrl}/${roomImageUrl}`,
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

  onNavUp(): void { this.viewer.setPitch(this.viewer.getPitch() + 50); }
  onNavDown(): void { this.viewer.setPitch(this.viewer.getPitch() - 50); }
  onNavLeft(): void { this.viewer.setYaw(this.viewer.getYaw() - 50); }
  onNavRight(): void { this.viewer.setYaw(this.viewer.getYaw() + 50); }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowUp') this.onNavUp();
    else if (e.key === 'ArrowDown') this.onNavDown();
    else if (e.key === 'ArrowLeft') this.onNavLeft();
    else if (e.key === 'ArrowRight') this.onNavRight();
  }

  onOpenPopup(): void {
    this.popupOverlayEl.nativeElement.style.display = 'flex';
    setTimeout(() => this.initWorldMap(), 10);
  }

  onClosePopup(): void {
    this.popupOverlayEl.nativeElement.style.display = 'none';
  }

  onSubmit(): void {
    if (!this.selectedLocation || !this.selectedFloor || !this.selectedRoom) {
      alert('Bitte wähle alle drei Schritte aus.');
      return;
    }

    this.http.post<{correctAnswer: boolean, gameEnd: boolean, game: IGame}>(`${environment.gameServiceBaseUrl}/game/check-answer`, {
      accessToken: localStorage.getItem('access_token'),
      selectedLocationId: this.selectedLocationId,
      selectedFloorId: this.selectedFloor,
      selectedRoomId: this.selectedRoom,
    }, {withCredentials: true}).subscribe({
      next: data => {
        const pointsThisRound = data.game.rounds[data.game.currentRoundNumber - 2].score;
        this.cumulativeScore += pointsThisRound;
        this.cdRef.detectChanges();

        const dialogRef = this.roundResultDialog.open(RoundResult, {
          data: {
            correctAnswer: data.correctAnswer,
            pointsEarned: pointsThisRound,
            gameEnd: data.gameEnd,
            roundResults: data.gameEnd ? data.game.rounds : []
          },
          disableClose: true,
          width: '400px'
        });

        dialogRef.afterClosed().subscribe(() => {
          if (data.gameEnd) {
            this.router.navigate(["/"]);
          } else {
            this.currentRound = data.game.currentRoundNumber;
            this.initPannellum(data.game.rounds[data.game.currentRoundNumber - 1].roomImgURL);
            this.resetGameState();
            this.cdRef.detectChanges();
          }
        });
      },
      error: err => {
        console.error("Submit answer error:", err);
      }
    });
    this.onClosePopup();
  }

  private resetGameState(): void {
    this.selectedLocation = null;
    this.selectedLocationId = null;
    this.selectedFloor = null;
    this.selectedRoom = null;
    this.lastFloorLayer = null;
    this.lastRoomLayer = null;

    if (this.worldMap) { this.worldMap.remove(); this.worldMap = null; }
    if (this.floorMap) { this.floorMap.remove(); this.floorMap = null; }
    if (this.roomMap) { this.roomMap.remove(); this.roomMap = null; }

    this.updateStepStatus(this.status1El.nativeElement, 'Nicht ausgewählt', false);
    this.updateStepStatus(this.status2El.nativeElement, 'Nicht ausgewählt', false);
    this.updateStepStatus(this.status3El.nativeElement, 'Nicht ausgewählt', false);

    this.step1El.nativeElement.open = true;
    this.step2El.nativeElement.open = false;
    this.step2El.nativeElement.classList.add('disabled');
    this.step3El.nativeElement.open = false;
    this.step3El.nativeElement.classList.add('disabled');
  }

  private initMapStyles(): void {
    this.osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
    this.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });

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
    [this.step1El, this.step2El, this.step3El].forEach(elRef => {
      elRef.nativeElement.addEventListener('toggle', (event) => {
        const step = event.target as HTMLDetailsElement;
        if (step.classList.contains('disabled') && step.open) {
          step.open = false;
          return;
        }
        if (step.open) {
          [this.step1El, this.step2El, this.step3El].forEach(other => {
            if (other.nativeElement !== step) other.nativeElement.open = false;
          });
          const mapId = step.querySelector('.map-container')?.id;
          setTimeout(() => {
            if (mapId === 'map-world') this.initWorldMap();
            if (mapId === 'map-floor') this.initFloorMap();
            if (mapId === 'map-room') this.initRoomMap();
          }, 50);
        }
      });
    });
  }

  private initWorldMap(): void {
    if (this.worldMap) {
      this.worldMap.invalidateSize();
      return;
    }
    this.worldMap = L.map(this.mapWorldEl.nativeElement).setView([48.7758, 9.1829], 13);
    this.osmLayer.addTo(this.worldMap);

    const locations = [
      { name: "DHBW Stuttgart Fakultät Technik", id: "LE1", lat: 48.78268797542353, lon: 9.166966502976193 },
      { name: "DHBW Stuttgart Fakultät Sozialwesen", id: "SOZIALWESEN", lat: 48.770304288576966, lon: 9.157861346588032 },
      { name: "DHBW Stuttgart Fakultät Wirtschaft", id: "WIRTSCHAFT", lat: 48.77363959932411, lon: 9.170890916551944 },
      { name: "DHBW Stuttgart Campus Horb", id: "HORB", lat: 48.44548420120876, lon: 8.696825707988424 },
    ];

    let activeMarker: any = null;
    locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lon], { icon: this.defaultIcon })
        .bindTooltip(loc.name, { permanent: true, direction: 'top', offset: [0, -30] })
        .addTo(this.worldMap);

      marker.on('click', () => {
        if (activeMarker) activeMarker.setIcon(this.defaultIcon);
        marker.setIcon(this.activeIcon);
        activeMarker = marker;
        this.selectedLocation = loc.name;
        this.selectedLocationId = loc.id;

        this.updateStepStatus(this.status1El.nativeElement, `Ausgewählt: ${loc.name}`);
        this.step2El.nativeElement.classList.remove('disabled');

        this.locationNotAvailable = false;
        this.cdRef.detectChanges();

        if (this.step2El.nativeElement.open) {;
          this.initFloorMap();
        } else {
          this.step2El.nativeElement.open = true;
        }
      });
    });
  }

  private initFloorMap(): void {
    if (!this.floorMap) {
      this.floorMap = L.map(this.mapFloorEl.nativeElement, { crs: L.CRS.Simple, minZoom: -1 });
    }
    this.updateFloorSideview();
  }

  private updateFloorSideview(): void {
    this.locationNotAvailable = false;
    this.cdRef.detectChanges();

    setTimeout(() => {

      if (this.floorMap) {
        this.floorMap.remove();
        this.floorMap = null;
        this.floorImageLayer = null;
        this.floorGeoLayer = null;
      }

      this.floorMap = L.map(this.mapFloorEl.nativeElement, {
        crs: L.CRS.Simple,
        minZoom: -1
      });

      const imageWidth = 1000, imageHeight = 750;
      const geoWidth = 801, geoHeight = 445;
      const scaleX = imageWidth / geoWidth, scaleY = imageHeight / geoHeight;
      const bounds: L.LatLngBoundsExpression = [[0, 0], [imageHeight, imageWidth]];

      this.floorImageLayer = L.imageOverlay(
        `${environment.gameServiceBaseUrl}/img/sideview/${this.selectedLocationId}`,
        bounds
      ).addTo(this.floorMap);

      this.floorMap.fitBounds(bounds);

      this.http.get(`${environment.gameServiceBaseUrl}/geo-data/sideview/${this.selectedLocationId}`).subscribe({
        next: (geoJson) => {
          if (!this.floorMap) return;

          this.floorGeoLayer = L.geoJSON(geoJson as any, {
            coordsToLatLng: (coords: number[]) => L.latLng(imageHeight + coords[1] * scaleY, coords[0] * scaleX),
            style: this.defaultStyle,
            onEachFeature: (feature: any, layer: any) => {
              layer.on('click', () => {
                if (this.lastFloorLayer) this.lastFloorLayer.setStyle(this.defaultStyle);
                layer.setStyle(this.highlightStyle);
                this.lastFloorLayer = layer;
                this.selectedFloor = feature.properties.floor_id;
                this.updateStepStatus(this.status2El.nativeElement, `Ausgewählt: ${this.selectedFloor}`);
                this.step3El.nativeElement.classList.remove('disabled');
                this.step3El.nativeElement.open = true;
              });
            }
          }).addTo(this.floorMap);
        },
        error: (err) => {
          console.error("Error loading sideview geo-data:", err);
          if (err.status === 404) {
            this.locationNotAvailable = true;

            if (this.floorMap) {
              this.floorMap.remove();
              this.floorMap = null;
            }
            this.cdRef.detectChanges();
          }
        }
      });
    }, 100);
  }

  private initRoomMap(): void {
    if (this.roomMap) {
      this.roomMap.remove();
      this.roomMap = null;
    }

    const imageUrl = `${environment.gameServiceBaseUrl}/img/floor/${this.selectedFloor}`;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const w = img.width;
      const h = img.height;

      this.roomMap = L.map(this.mapRoomEl.nativeElement, {
        crs: L.CRS.Simple,
        minZoom: -2
      });

      const bounds: L.LatLngBoundsExpression = [[0, 0], [h, w]];
      L.imageOverlay(imageUrl, bounds).addTo(this.roomMap);
      this.roomMap.fitBounds(bounds);

      this.http.get(`${environment.gameServiceBaseUrl}/geo-data/floor/${this.selectedFloor}`)
        .subscribe((geoJson) => {
          L.geoJSON(geoJson as any, {
            coordsToLatLng: (coords: number[]) => {
              return L.latLng(h + coords[1], coords[0]);
            },
            style: this.defaultStyle,
            onEachFeature: (feature: any, layer: any) => {
              layer.on('click', () => {
                if (this.lastRoomLayer) this.lastRoomLayer.setStyle(this.defaultStyle);
                layer.setStyle(this.highlightStyle);
                this.lastRoomLayer = layer;
                this.selectedRoom = feature.properties.room_id;
                this.updateStepStatus(this.status3El.nativeElement, `Ausgewählt: ${this.selectedRoom}`);
              });
            }
          }).addTo(this.roomMap);
        });
    };
  }

  private updateStepStatus(element: HTMLElement, text: string, addClass = true): void {
    element.textContent = text;
    if (addClass) element.classList.add('selected');
    else element.classList.remove('selected');
  }
}
