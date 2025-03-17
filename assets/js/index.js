document.addEventListener("DOMContentLoaded", () => {

    /* récupération des éléments html */
    const playerInput = document.getElementById("player-name");
    const searchButton = document.getElementById("search-btn");
    const favButton = document.getElementById("fav-btn");

    const platformRadios = document.getElementsByName("platform");
    const timeWindowRadios = document.getElementsByName("time-window");

    const responseContainer = document.getElementById("response-container");
    const infoMessage = responseContainer.querySelector(".info");
    const errorMessage = document.getElementById("response-error");
    const validResponse = document.getElementById("response-valid");

    /*Objet littéral qui contiendra tout les favoris*/
    let tabFavoritePlayer = {};

    /* constantes */
    const API_URL = "https://fortnite-api.com/v2/stats/br/v2";
    const API_KEY = "6f3cdb97-1f92-4afb-b450-8870cc218abf";

    /*
    * Fonction pour activer/désactiver le bouton de recherche
     */
    function toggleSearchButton() {
        const isEmpty = playerInput.value.trim() === "";
        searchButton.disabled = isEmpty;
        searchButton.classList.toggle("disabled", isEmpty);
        favButton.disabled = isEmpty;
        favButton.classList.toggle("disabled", isEmpty);
    }

    /*
    * Fonction pour récupérer les stats d'un joueur qui retourne une promesse sous forme d'un objet
     */
    function getPlayerStats(playerName, plateforme, timeframe) {
        const validPlatforms = ["epic", "psn", "xbl"];
        const validTimeframes = ["season", "lifetime"];

        plateforme = plateforme.toLowerCase();
        timeframe = timeframe.toLowerCase();

        if (!validPlatforms.includes(plateforme)) {
            console.error(`Plateforme invalide : "${plateforme}". Doit être "epic", "psn" ou "xbox".`);
            return Promise.reject("Paramètre plateforme invalide");
        }

        if (!validTimeframes.includes(timeframe)) {
            console.error(`Timeframe invalide : "${timeframe}". Doit être "season" ou "lifetime".`);
            return Promise.reject("Paramètre timeframe invalide");
        }

        return fetch(`${API_URL}?name=${playerName}&accountType=${plateforme}&timeWindow=${timeframe}`, {
            headers: { "Authorization": API_KEY }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur API: ${response.status}`);
                }
                return response.json();
            })
            .then(data => ({
                name: data.data.account.name,
                deaths: data.data.stats.all.overall.deaths,
                kills: data.data.stats.all.overall.kills,
                kd: data.data.stats.all.overall.kd,
                killsPerMatch: data.data.stats.all.overall.killsPerMatch,
                matches: data.data.stats.all.overall.matches,
                minutesPlayed: data.data.stats.all.overall.minutesPlayed,
                wins: data.data.stats.all.overall.wins,
                top3: data.data.stats.all.overall.top3,
                top5: data.data.stats.all.overall.top5,
                top10: data.data.stats.all.overall.top10,
                winRate: data.data.stats.all.overall.winRate
            }));
    }

    /*
    * Fonction pour mettre à jour l'interface utilisateur avec les statistiques du joueur
     */
    function updateUIWithStats(stats) {
        document.getElementById("response-valid").classList.remove("hidden");

        document.getElementById("response-valid").querySelector("h1").textContent = stats.name;
        document.getElementById("kills").querySelector(".number").textContent = stats.kills;
        document.getElementById("kd").querySelector(".number").textContent = stats.kd;
        document.getElementById("deaths").querySelector(".number").textContent = stats.deaths;
        document.getElementById("wins").querySelector(".number").textContent = stats.wins;
        document.getElementById("top-3").querySelector(".number").textContent = stats.top3;
        document.getElementById("top-5").querySelector(".number").textContent = stats.top5;
        document.getElementById("top-10").querySelector(".number").textContent = stats.top10;
        document.getElementById("winrate").querySelector(".number").textContent = stats.winRate;
        document.getElementById("nb-matchs").querySelector(".number").textContent = stats.matches;
        document.getElementById("minutes-played").querySelector(".number").textContent = stats.minutesPlayed;
    }

    /*
    * Fonction pour gérer la recherche du joueur
     */
    function handleSearch() {
        infoMessage.classList.add("hidden");
        errorMessage.classList.add("hidden");
        validResponse.classList.add("hidden");

        const playerName = playerInput.value.trim();
        const plateforme = [...platformRadios].find(radio => radio.checked).value;
        const timeframe = [...timeWindowRadios].find(radio => radio.checked).value;

        searchButton.disabled = true;
        searchButton.textContent = "Chargement...";

        getPlayerStats(playerName, plateforme, timeframe)
            .then(stats => {
                updateUIWithStats(stats);
            })
            .catch(() => {
                errorMessage.classList.remove("hidden");
            })
            .finally(() => {
                searchButton.disabled = false;
                searchButton.textContent = "Rechercher";
            });
    }

    searchButton.addEventListener("click", handleSearch);
    playerInput.addEventListener("input", toggleSearchButton);
    toggleSearchButton();

    /**
     * Fonction pour gérer les favoris dans le local storage
     */
    function updateLocalStorage() {
        // On récupère le nom du joueur, plateforme et timeframe
        const playerName = playerInput.value.trim();
        const plateforme = [...platformRadios].find(radio => radio.checked).value;
        const timeframe = [...timeWindowRadios].find(radio => radio.checked).value;

        getPlayerStats(playerName, plateforme, timeframe)
            .then(stats => {
                console.log("Les stats après avoir cliqué sur favoris :", stats);

                // Récupération des favoris existants dans localStorage
                let tabFavoritePlayer = JSON.parse(localStorage.getItem("Favorites Players")) || [];

                // Vérification si le joueur est déjà en favori (évite les doublons)
                if (!tabFavoritePlayer.some(player => player.name === stats.name)) {
                    tabFavoritePlayer.push(stats);
                }

                // Enregistrement des favoris mis à jour dans localStorage
                localStorage.setItem("Favorites Players", JSON.stringify(tabFavoritePlayer));

            })
            .catch(() => {
                errorMessage.classList.remove("hidden");
            })
            .finally(() => {
                favButton.disabled = false;
            });
    }


    favButton.addEventListener("click", updateLocalStorage);
});