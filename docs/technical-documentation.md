# Technical Documentation - DHBW360

---

## 1. Services
The backend is divided into two primary, loosely coupled microservices covering specific application domains. This separation allows for independent scaling and development.

### A. Game-Service

The core of the application controlling game logic, room management, and media delivery.

* **Directory:** `/game-service`
* **Key Responsibilities:**
  * Management of game sessions
  * Provision of geographical data for locations and floor plans
  * Delivery of static assets (floor plans, room images, side views of DHBW buildings)

#### Important Modules & Classes:

1. **`RoomManager` (`room-manager.ts`)**:
   * Loads and stores all available rooms

2. **`GameManager` (`game-manager.ts`)**:
   * Controls the game flow (start, round logic, end)
   * Uses `random-selector.ts` to select random rooms at the start of the game

3. **`S3 Service` (`s3.ts`) & `ImageService` (`image-service.ts`)**:
   * Abstraction layer for cloud storage access (AWS S3)
   * Used for fetching and caching images (`/download/rooms`, `/download/floor-plans`) and static geodata (`/download/geo-data`).

### B. Score-Service

A dedicated service for managing player results.

* **Directory:** `/score-service`
* **Key Responsibilities:**
  * Storing player results
  * Providing high score lists
  * Database communication to store and retrieve player results

#### Important Modules:

1. **`ScoreManager` (`score-manager.ts`)**:
   * Contains functions to write scores to or load them from the database.
   * Provides lists of top scores

2. **`Database` (`database.ts`)**:
   * Encapsulates the database connection
   * Contains the `executeQuery` function to perform database queries easily from the outside.

---

## 3. API Interfaces (Endpoints)

### Game API

Logged-in users provide an accessToken, while not logged in ones do not. That is why accessToken is marked as optional.

| Method | Endpoint | Description                                                                                                                 | File | Parameters                                                                                                        |
| :--- | :--- |:----------------------------------------------------------------------------------------------------------------------------| :--- |:------------------------------------------------------------------------------------------------------------------|
| `POST` | `/game/start` | Initiates a new game.                                                                                                       | `game-routes.ts` | AccessToken: string (optional)<br>rounds: int                                                                     |
| `POST` | `/game/check-answer` | Frontend sends the room data selected by the user and this endpoint checks if it is correct. It also starts the next round. | `game-routes.ts` | AccessToken: string (optional)<br>selectedLocationId: string<br>selectedFloorId: string<br>selectedRoomId: string |
| `GET` | `/geodata/sideview/:locationId` | Returns geodata for a location side view.                                                                                   | `geodata-routes.ts` | locationId: string                                                                                                |
| `GET` | `/geodata/floor/:floorId` | Returns geodata for a floor plan.                                                                                           | `geodata-routes.ts` | floorId: string                                                                                                   |
| `GET` | `/img/room/:roomId` | Returns the panoramic image of a room.                                                                                      | `image-routes.ts` | roomId: string                                                                                                    |
| `GET` | `/img/sideview/:locationId` | Returns the image of a location's side view.                                                                                | `image-routes.ts` | locationId: string                                                                                                |
| `GET` | `/img/floor/:floorId` | Returns the image of a floor plan.                                                                                          | `image-routes.ts` | floorId: string                                                                                                   |

### Score API

| Method | Endpoint | Description | File | Parameters |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/score/top` | Returns a list of highest scores. Sorted descending from rank `min` to `max`. | `score-routes.ts` | min: int<br>max: int |
| `POST` | `/score/get/:username` | Returns the score of a player. | `score-routes.ts` | username: string |
| `GET` | `/score/add` | Adds a score value to a player. | `score-routes.ts` | authKey: string (Allowed only to be called by game-service, not by a player)<br>username: string<br>amount: int |

---

## 4. Data Model & Assets

### Data Model

The backend services are object-oriented and contain interfaces to define types.

### Static Files (Assets)

The Game-Service downloads all static files from the S3 Cloud at startup and saves them in the `download/` folder:

* **`floor-plans/`**: Contains floor plans (e.g., `LE1_0_floorplan.png`, `LE1_sideview.png`)
* **`rooms/`**: Contains panoramic images of rooms (e.g., `LE1_A3_02.jpg`)
* **`geo-data/`**: Contains GeoJSON files for floor plans and building side views.

---

## 5. Setup & Deployment

### Prerequisites

* **Runtime:** Node.js Version 22
* **Package Manager:** npm
* **Containerization:** Docker

### Environment Variables (`.env`)

Each backend service requires a `.env` file located in the root directory of the services.

**Game Service .env (`/backend/game-service/.env`)**
```text
PRODUCTION=<true/false>
SESSION_SECRET=<RANDOM STRING>
S3_REGION=eu-central-1
S3_BUCKET_NAME=dhbw360
S3_ACCESS_KEY=<S3 Access Key>
S3_SECRET_KEY=<S3 Secret Key>
LOGIN_BASE_URL=https://vsv-research.volkmann-webservices.de/auth
AUTH_KEY=<RANDOM STRING same as AUTH_KEY for Score Service>
SCORE_SERVICE_API=<URL to ScoreService API>
DB_HOST=vsv-research.volkmann-webservices.de
DB_PORT=5432
DB_USER=<Username>
DB_PASSWORD=<Password>
DB_DATABASE=dhbw360
EXPRESS_PORT=<Port for express server>
HOST=<Address of the frontend service e.g. http://localhost:4200>

```

**Score Service .env (`/backend/score-service/.env`)**

```text
PRODUCTION=<true/false>
SESSION_SECRET=<RANDOM STRING>
DB_HOST=vsv-research.volkmann-webservices.de
DB_PORT=5432
DB_USER=<Username>
DB_PASSWORD=<Password>
DB_DATABASE=dhbw360
AUTH_KEY=<RANDOM STRING same as AUTH_KEY for Game Service>
EXPRESS_PORT=<Port for express server>

```

### Building the Services

Build scripts are available in all services.

**Frontend:**
Navigate to the `DHBW360/frontend/` folder in the terminal and run `npm run build` to build the development version.
For the production version: `npm run build:prod`

**Game-Service & Score-Service:**
Navigate to the `DHBW360/backend/` folder in the terminal and run `npm run build:game-service` or `npm run build:score-service` or `npm run build:all`.

### Starting Services via Docker

Dockerfiles are present in every service. All services can be started using the `/docker/docker-compose.yml` file.
After building, the folder structure on the production system must look as follows to use the docker-compose.yml:

```text
DHBW360/
├── backend/
│   ├── game-service/
│   │   ├── dist/
│   │   │   └── index.js
│   │   └── Dockerfile
│   ├── score-service/
│   │   ├── dist/
│   │   │   └── index.js
│   │   └── Dockerfile
│   └── package.json
├── frontend/
│   ├── dist/
│   │   └── frontend/
│   │       └── browser/
│   │           └── index.html, ...
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml

```

### Testing

The project uses Vitest for integration tests in the Game-Service. These tests simulate an exemplary game flow with various HTTP requests.

To run the tests: Navigate to the `DHBW360/backend/game-service` folder and run `npm run test`.

---

## 6. Code Quality & Standards

* **TypeScript:** The entire project is typed, resulting in high maintainability and fewer runtime errors.
* **Modular Structure:** Clear separation of routes (API), managers (logic), and technical services (S3, DB). This separates component responsibilities and increases clarity.
* **Code Conventions:** Please have a look at ``/docs/conventions.md``.