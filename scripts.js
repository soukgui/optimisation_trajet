window.onload = function(){
    let macarte = L.map("carte").setView([48.852969, 2.349903], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: 'données OpenStreetMap France',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);

    // Tableau pour stocker les marqueurs
    let markers = [];

    // Création d'un marqueur avec sous-titre sur clic droit
    macarte.on('contextmenu', function(event){
        let latitude = event.latlng.lat;
        let longitude = event.latlng.lng;

        // Demander à l'utilisateur de saisir un sous-titre
        let sousTitre = prompt('Entrez le sous-titre pour ce marqueur :');

        // Création du marqueur avec sous-titre
        let marker = L.marker([latitude, longitude]).addTo(macarte);
        marker.bindTooltip(sousTitre).openTooltip();

        // Ajouter un gestionnaire d'événements pour le clic sur le marqueur
        marker.on('click', function(event) {
            let nouveauSousTitre = prompt('Entrez le nouveau sous-titre pour ce marqueur :');
            if (nouveauSousTitre !== null) {
                marker.bindTooltip(nouveauSousTitre).openTooltip();
            }
        });

        // Stocker le marqueur dans le tableau
        markers.push(marker);
    });

    // Ajout de la route
    L.Routing.control({
        waypoints: [], // Vous devez ajouter les waypoints ici s'ils sont disponibles
        geocoder: L.Control.Geocoder.nominatim(),
        lineOptions: {
            styles: [{
                color: '#839c49',
                opacity: 1,
                weight: 5
            }]
        },
        // service de routage OSRM v1
        router: new L.Routing.OSRMv1({
            language: 'fr',
            profile: 'car',
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        }),
        formatter: new L.Routing.Formatter({
            language: 'fr'
        }),
        createMarker: function(i, waypoint, n) {
            if (i == n - 1) {
                // Marqueur pour la dernière étape (destination)
                return L.marker(waypoint.latLng, {
                    icon: L.divIcon({
                        className: 'destination-marker',
                        html: '<div class="destination-marker-icon">' + n + '</div>'
                    })
                });
            } else {
                // Marqueur pour les autres étapes
                return L.marker(waypoint.latLng, {
                    icon: L.divIcon({
                        className: 'waypoint-marker',
                        html: '<div class="waypoint-marker-icon">' + (i + 1) + '</div>'
                    })
                });
            }
        }
    }).addTo(macarte);

    // Ajouter un marqueur manuellement à partir d'une adresse saisie
    document.getElementById("ajouterMarqueur").addEventListener("click", function(){
        let adresse = document.getElementById("adresse").value;

        // Utiliser le service de géocodage pour obtenir les coordonnées de l'adresse
        L.Control.Geocoder.nominatim().geocode(adresse, function(results) {
            if (results && results.length > 0) {
                let coordonnees = [
                    results[0].center.lat,
                    results[0].center.lng
                ];

                L.marker(coordonnees).addTo(macarte)
                    .bindPopup(adresse)
                    .openPopup();
            } else {
                alert("Adresse non trouvée");
            }
        });
    });
    
    
    
}
