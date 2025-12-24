# 🎓 DHBW360

---

## 🧭 1. Kontext

### a. Beschreibung

DHBW360 ist ein interaktives GeoGuesser-Spiel, das das Wissen Wissen der Spieler über die Duale Hochschule auf die Probe stellt.
Die Aufgabe der Spieler ist es, anhand von Bildern spezifische Räume den verschiedenen DHBW-Standorten zuzuordnen.

### b. Stakeholder

| Stakeholder               | Beschreibung              | Ziel / Interesse                                      |
|---------------------------|---------------------------|-------------------------------------------------------|
| 🧑‍🎓 **Studierende**     | Hauptnutzende des Spiels  | Campus kennenlernen & andere Studierende herausfordern |
| 🏫 **DHBW Stuttgart**   | Betreiber des Spiels      | Studierende lernen Campus kennen, Vielfalt der DHBW vermitteln
| 🧑‍💻 **Entwicklungsteam** | Studentisches Projektteam | Umsetzung eines durchgängigen Softwareprojekts        |

---

## ⚙️ 2. Funktionale Anforderungen

| Anforderung                  | Beschreibung                                                        | Priorität |
|------------------------------|---------------------------------------------------------------------|-----------|
| **Startseite**               | Spieler bekommen zu Beginn eine Startseite angezeigt                | 🟢 Hoch |
| **Bestenliste**              | Spieler bekommen auf der Startseite eine Bestenliste angezeigt      | 🟠 Mittel |
| **Anmeldung**                | Spieler können sich ein Konto erstellen und sich damit anmelden     | 🟠 Mittel |
| **Spiel starten**            | Spieler kann die Anzahl der Runden auswählen und das Spiel starten  | 🟢 Hoch |
| **Raumbild anzeigen**        | Das 360°-Bild eines zufälligen Raumes wird dem Spieler angezeigt    | 🟢 Hoch |
| **Standort auswählen**       | Der Spieler kann den vermuteten Standort auswählen                  | 🟢 Hoch |
| **Etage auswählen**          | Der Spieler kann die vermutete Etage auswählen                      | 🟢 Hoch |
| **Raum auswählen**           | Der Spieler kann den vermuteten Raum auswählen                      | 🟢 Hoch |
| **Punkte speichern**         | Die erzielte Punktzahl wird gespeichert                             | 🟠 Mittel |
| **Sieg/Niederlage anzeigen** | Dem Spieler wird angezeigt, ob er den richtigen Raum ausgewählt hat | 🟢 Hoch |
---

## 🧱 3. Nicht-funktionale Anforderungen

| Kategorie | Beschreibung                                                        | Ziel                                        |
|------------|---------------------------------------------------------------------|---------------------------------------------|
| 🧠 **Usability** | Intuitive, klare Benutzeroberfläche                                 | Geringe Einarbeitungszeit                   |
| ⚡ **Performance** | Ladezeiten < 1 Sekunden für Bilder                                  | Hohe Reaktionsgeschwindigkeit               |
| ☁️ **Verfügbarkeit** | Deployment auf Server                                               | 24/7 verfügbar                              |
| 🧩 **Modularität** | Erweiterbare Architektur (z. B. Angular-Komponenten, Microservices) | Skalierbarkeit sicherstellen                |
| 🧪 **Testbarkeit** | Integrationstests vorhanden                               | Funktionalität sicherstellen |
| 🔄 **Wartbarkeit** | Saubere Code-Struktur, Dokumentation                                | Einfache Weiterentwicklung                  |

---

## 🧭 4. Abgrenzung & MVP

Das Projekt wird **inkrementell** entwickelt. Ziel ist zunächst ein **Minimal Viable Product (MVP)**, das den Kernnutzen demonstriert.

### 🎯 MVP (Umfang des Projekts)
- Anzeigen einer Startseite
- Rundenauswahl und Spiel starten
- Bestenliste anzeigen
- Nutzer kann sich anmelden, um seine Punkte zu speichern und in der Bestenliste zu erscheinen
- Zufälliges Raumbild anzeigen
- Standort-, Etagen- und Raumauswahl
- Punktevergabe und Anzeige von Sieg/Niederlage

### 🚫 Nicht Teil des MVP
- Multiplayer-Modus
- Hardcore-Modus mit eingeschränkter Zeit & eingeschränktem Sichtfeld
- Bilder von weiteren DHBW-Standorten
- Erweiterte Statistiken oder Profile
- Soziale Funktionen (Freunde hinzufügen, Herausforderungen)
- Erweiterte Bildanalyse (z. B. Hinweise im Bild erkennen)

Diese Funktionen können in einem späteren Release oder als Erweiterung umgesetzt werden.

---

## 🧩 Architektur
> Detaillierte C4-Diagramme folgen in `docs/diagrams/C4-Diagram.pdf`

- **Context:** DHBW360 als Teil der Campus App
- **Container:** Web-Anwendung (Angluar), Game-Service (Node.js), Score-Service (Node.js), Datenbank (PostgreSQL), AWS S3 Bucket
- **Component:** Web-Anwendung, Game-Service, Score-Service
- **Code:** TypeScript / Angular-Komponenten

---

## 👥 Team & Organisation
| Name           | Verantwortlichkeit          |
|----------------|-----------------------------|
| Lisa Natterer  | Frontend-Entwicklung        |
| Leonie Reusch  | Dokumentation und Diagramme |
| Daniel Ziegler | Backend-Entwicklung          |

---

## 🧰 Tools & Technologien
- **Frontend:** Angular
- **Backend:** Node.js mit Express
- **Database:** PostgreSQL
- **Cloud Storage:** AWS S3 Bucket
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Projektmanagement:** GitHub Projects & Issues

---

> 📘 Weitere Dokumente:
> - [`docs/diagrams/C4-Diagram.pdf`](docs/diagrams/C4-Diagram.pdf) – C4-Modell
> - [`docs/diagrams/Eventstorming.pdf`](docs/diagrams/Eventstorming.pdf) – Eventstorming
> - [`docs/diagrams/usecase-diagram.svg`](docs/diagrams/usecase-diagram.svg) – Use-Case-Diagramm
> - [`docs/geodata-documentation.md`](docs/geodata-documentation.md) – QGIS Digitization Workflow
> - [`docs/technical-documentation.md`](docs/technical-documentation.md) – Technische Dokumentation
> - [`docs/responsibilities.md`](docs/responsibilities.md) – Verantwortlichkeiten im Projekt
> - [`docs/reflection-and-learnings.md`](docs/reflection-and-learnings.md) – Reflexion und Learnings

---