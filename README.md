# DHBW360

## Beschreibung
Minigame, bei dem mit Hilfe eines 360° Views des Raumes geraten werden muss,  
in welchem Raum und auf welchem Stockwerk der DHBW Stuttgart Fakultät Technik das Foto aufgenommen wurde.  
Diese Fotos werden nach dem Starten einer Runde angezeigt. Der Nutzer hat Zugriff auf den DHBW Fakultät Technik Grundriss  
und muss den korrekten Raum finden, der auf dem Foto gezeigt wird.

---

## Funktional
- User-Ansicht zum Spielstart
- Scores speichern und anzeigen
- Zufälliges Anzeigen eines 360°-Bilds und der Raumpläne
- Auswahl eines Raumplans (Stockwerk)
- Auswahl eines Raums

---

## Nicht funktional
- Single Player Game
- Geringe Responsetime und schnelles Laden der Bilder (max. 1s)
- Saubere UX
- Clean Code
- Dokumentation
- WebApp

---

## Abgrenzung (MVP)
- 16:9 Bild von einem Raum (Anzeigen)
- Verbindung zwischen Bildern und Raumplan (Auswahl)
- Ausgabe des Ergebnisses

---

## Technologien
- QCIS https://qgis.org/ is used for being able to select the roomes in the floorplan.
- Angular https://angular.dev/ is used as framework with typescript.
- Tailwind css https://tailwindcss.com/ for modern web design.
- s3 bucket https://aws.amazon.com/de/s3/ for working with the pictures of the rooms.
- Docker
  
