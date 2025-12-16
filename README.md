# DHBW360

## Description
This is a minigame, where the User has to guess the room, floor and campus of the DHBW Stuttgart based on a 360° picture.
The pictures will be shown after the start of a round. The User will get the floor plan of the DHBW location and has to find the correct room that was shown.


---

## Functional
- User-View at Game-Start
- save and show score
- random selecting and showing of a room picture
- selecting location (map)
- selecting floor and room

---

## Non-functional
- Single Player Game
- short response time and fast loading of the images (max. 1s)
- clean UX
- clean Code
- documentation
- WebApp

---

## Distinction (MVP)
- scenic image (360°) from a room 
- connection between the image and location, floor and room
- show result and score
- an authentification system is not needed as it will be provided by the general DHBW Stuttgart Campus App page
---

## Technologies
- QCIS https://qgis.org/ is used for being able to select the roomes in the floorplan.
- Angular https://angular.dev/ is used as frontend framework with typescript.
- Tailwind css https://tailwindcss.com/ for modern web design.
- S3 Bucket https://aws.amazon.com/de/s3/ for working with the pictures of the rooms.
- Docker
  
