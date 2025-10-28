// 1. Initialisierung der Karte
// Da es sich um keine echte Geokarte handelt, definieren wir ein simples Koordinatensystem (CRS)
// Leaflet verwendet standardmäßig ein kartesisches Koordinatensystem, das sich gut für Bilder eignet.
const map = L.map('map', {
    crs: L.CRS.Simple, // Verwendet ein einfaches, nicht-geographisches Koordinatensystem
    minZoom: -2,      // Erlaubt das Hinein- und Herauszoomen
    maxZoom: 2,
    zoomDelta: 0.5,
    zoomSnap: 0.5
});

// ********************************************
// 2. Einbinden des Bildes als Hintergrund-Layer
// ********************************************

// HINWEIS: Bei L.CRS.Simple sind die Koordinaten [Y, X]
// Y-Werte müssen negativ sein, um Y=0 oben zu haben
const imageWidth = 1026; // <<< ANPASSEN: Tatsächliche Breite Ihres Bildes
const imageHeight = 946; // <<< ANPASSEN: Tatsächliche Höhe Ihres Bildes

const imageBounds = [
    [0, 0],                            // Obere linke Ecke (y=0, x=0)
    [-imageHeight, imageWidth]         // Untere rechte Ecke (y=-800, x=1000)
];
const imageUrl = 'grundriss.jpg'; // **PFAD ZU IHREM BILD**

// Fügt das Bild der Karte hinzu und passt die Ansicht (View) an
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds); // Stellt sicher, dass das Bild beim Start komplett sichtbar ist


// ********************************************
// 3. Laden der GeoJSON-Datei und Hinzufügen der Interaktivität
// ********************************************

fetch('raeume.geojson') // **PFAD ZU IHRER GEOJSON-DATEI**
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            // Standard-Styling der Polygone
            style: function (feature) {
                return {
                    color: '#773377',     // Randfarbe
                    weight: 2,            // Randdicke
                    opacity: 0.5,         // Transparenz des Randes
                    fillColor: '#773377', // Füllfarbe
                    fillOpacity: 0.3      // Fülltransparenz (sehr transparent, um das Bild zu sehen)
                };
            },
            // Interaktivität für jedes Feature (Raum-Polygon)
            onEachFeature: function (feature, layer) {
                // Fügen Sie einen Pop-up hinzu, der den Raumnamen anzeigt (aus den GeoJSON-Attributen)
                if (feature.properties && feature.properties.raum_name) {
                    layer.bindPopup('Raum: ' + feature.properties.raum_name);
                }

                // Event-Listener für Selektion (Hover/Klick-Effekte)
                layer.on({
                    // Bei Mouseover: Style ändern
                    mouseover: function (e) {
                        e.target.setStyle({
                            fillOpacity: 0.5,     // Füllung sichtbar machen
                            weight: 4             // Rand dicker machen
                        });
                    },
                    // Bei Mouseout: Style zurücksetzen
                    mouseout: function (e) {
                        e.target.setStyle({
                            fillOpacity: 0.3,     // Füllung wieder transparent
                            weight: 2
                        });
                    },
                    // Bei Klick: Raum selektieren
                    click: function (e) {
                        // Hier können Sie die Logik für die Raumselektion einfügen
                        alert('Sie haben Raum selektiert: ' + feature.properties.raum_name);
                        
                        //Sie können auch eine Klasse hinzufügen, um den Raum dauerhaft zu markieren
                        e.target.setStyle({ fillColor: 'red' });
                    }
                });
            }
        }).addTo(map);
    });