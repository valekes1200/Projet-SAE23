// Fonction pour récupérer les données météorologiques d'une commune
function récupérerMétéo(codeCommune, days, latitude, longitude, rain, windSpeed, windDirection) {
    // Clé API pour accéder au service météorologique
    const cléAPI = '3f5edb23a4c5fd475f199e84bf09ed8fb6cd85e636b7951360a5e3b3ce5cfb24';

    // Effectue une requête fetch vers l'API météo avec le code de la commune et la clé API
    fetch(`https://api.meteo-concept.com/api/forecast/daily?insee=${codeCommune}&token=${cléAPI}`)
        .then(réponse => {
            // Vérifie si la réponse est OK
            if (!réponse.ok) {
                throw new Error('Erreur réseau ou serveur');
            }
            // Convertit la réponse en JSON
            return réponse.json();
        })
        .then(données => afficherMétéo(données, days, latitude, longitude, rain, windSpeed, windDirection)) // Appelle la fonction pour afficher les données météo
        .catch(erreur => {
            // Gère les erreurs en les affichant dans la console
            console.error('Erreur lors de la récupération des données météo:', erreur);
            // Affiche un message d'erreur dans l'élément avec l'ID 'weatherInfo'
            document.getElementById('weatherInfo').textContent = 'Erreur lors de la récupération des données météo.';
        });
}

// Fonction pour afficher les données météorologiques
function afficherMétéo(données, days, latitude, longitude, rain, windSpeed, windDirection) {
    // Sélectionne l'élément avec l'ID 'weatherInfo'
    const infoMétéo = document.getElementById('weatherInfo');

    // Récupère les prévisions météo pour les jours sélectionnés
    const prévisions = données.forecast.slice(0, days);

    // Obtient la date actuelle
    const dateActuelle = new Date();

    // Options pour formater la date en français
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // Initialise le contenu HTML de l'élément 'weatherInfo'
    let contenuHTML = `<h2>Prévisions pour ${données.city.name}</h2>`;

    // Parcourt chaque prévision et ajoute les informations à afficher
    prévisions.forEach((prévision, index) => {
        const datePrévision = new Date(dateActuelle);
        datePrévision.setDate(dateActuelle.getDate() + index);
        const datePrévisionFormatée = datePrévision.toLocaleDateString('fr-FR', options);

        contenuHTML += `
            <h3>Prévisions pour le ${datePrévisionFormatée}</h3>
            <p>Température minimale : ${prévision.tmin}°C</p>
            <p>Température maximale : ${prévision.tmax}°C</p>
            <p>Probabilité de pluie : ${prévision.probarain}%</p>
            <p>Heures d'ensoleillement : ${prévision.sun_hours} heures</p>
            ${latitude ? `<p>Latitude : ${données.city.latitude}</p>` : ''}
            ${longitude ? `<p>Longitude : ${données.city.longitude}</p>` : ''}
            ${rain ? `<p>Cumul de pluie : ${prévision.rr10} mm</p>` : ''}
            ${windSpeed ? `<p>Vent moyen : ${prévision.wind10m} km/h</p>` : ''}
            ${windDirection ? `<p>Direction du vent : ${prévision.dirwind10m}°</p>` : ''}
        `;
    });

    // Met à jour le contenu HTML de l'élément 'weatherInfo' avec les données météo
    infoMétéo.innerHTML = contenuHTML;
}

// Ajoute un écouteur d'événement pour détecter les clics sur le bouton "Afficher les prévisions"
document.getElementById('showForecast').addEventListener('click', function() {
    // Récupère le code de la ville sélectionnée
    const codeVilleSélectionnée = document.getElementById('citySelect').value;

    // Récupère les valeurs des nouveaux champs du formulaire
    const days = parseInt(document.getElementById('days').value);
    const latitude = document.getElementById('latitude').checked;
    const longitude = document.getElementById('longitude').checked;
    const rain = document.getElementById('rain').checked;
    const windSpeed = document.getElementById('windSpeed').checked;
    const windDirection = document.getElementById('windDirection').checked;

    // Vérifie si une ville a été sélectionnée
    if (codeVilleSélectionnée) {
        // Appelle la fonction pour récupérer la météo de la ville sélectionnée
        récupérerMétéo(codeVilleSélectionnée, days, latitude, longitude, rain, windSpeed, windDirection);
    } else {
        // Affiche une alerte si aucune ville n'est sélectionnée
        alert('Veuillez sélectionner une ville.');
    }
});
