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
                winRate: data.data.stats.all.overall.winRate,
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
        document.getElementById("minutes-played").querySelector(".number").textContent = Math.round(stats.minutesPlayed / 60)
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


        console.log("Prenom du joueur " , playerName); //Correct

        searchButton.disabled = true;
        searchButton.textContent = "Chargement...";

        getPlayerStats(playerName, plateforme, timeframe)
            .then(stats => {
                updateUIWithStats(stats);
                console.log("Prenom dans la réponse API" , stats.name); //Pas correct
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

                // Récupération des favoris existants dans localStorage
                let tabFavoritePlayer = JSON.parse(localStorage.getItem("Favorites Players")) || [];

                // Vérification si le joueur est déjà en favori (évite les doublons)
                if (!tabFavoritePlayer.some(player => player.name === stats.name)) {
                    //Je recupere mes stats + j'ajoute a ce tableau le playerName, plateforme , timeframe

                    let updateStats = {
                        ...stats,
                        playerName: playerName,
                        plateforme: plateforme,
                        timeframe: timeframe,
                    };

                    tabFavoritePlayer.push(updateStats);
                }

                // Enregistrement des favoris mis à jour dans localStorage
                //On enregistre les infos de l'utilisateur + (nom, plateforme,windowtime) pour refaire des requetes API quand on retrieve
                localStorage.setItem("Favorites Players", JSON.stringify(tabFavoritePlayer));
                console.log("Les stats après avoir cliqué sur favoris :", JSON.parse(localStorage.getItem("Favorites Players")));



            })
            .catch(() => {
                errorMessage.classList.remove("hidden");
            })
            .finally(() => {
                favButton.disabled = false;
            });
    }
    favButton.addEventListener("click", updateLocalStorage);


    /**
     * Méthode qui récupere les élements du local storage, pour rendre l'affichage persistant
     */
    function retrieveFromLocalStorage() {
        let players = JSON.parse(localStorage.getItem("Favorites Players")) || [];

        const favContainer = document.getElementById("fav-container");
        const favList = document.getElementById("fav-list");

        favList.innerHTML = "";

        if (players.length === 0) {
            favContainer.classList.add("hidden");
            return;
        } else {
            favContainer.classList.remove("hidden");
        }

        players.forEach((player, index) => {
            console.log("Prenom du joueur:", player.name, "Plateforme:", player.plateforme, "Timeframe:", player.timeframe);

            // Création de la div joueur AVANT la requête API
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("favorite-player");
            playerDiv.setAttribute("data-index", index);

            // Ajout du contenu de base (sans stats)
            playerDiv.innerHTML = `
            <button class="delete-favori" data-index="${index}">❌</button>
            <h3>${player.name}</h3>
            <p><strong>Plateforme:</strong> ${player.plateforme}</p>
            <p><strong>Victoires:</strong> Chargement...</p>
        `;

            favList.appendChild(playerDiv);

            // 🔥 Requête API pour récupérer les vraies stats
            getPlayerStats(player.name, player.plateforme, player.timeframe)
                .then((stats) => {
                    playerDiv.querySelector("p:last-of-type").innerHTML =
                        `<strong>Victoires:</strong> ${stats.wins}`;
                });
        });
    }

    /**
     * Écouteur qui récupere fav-list et ajoute un évenement au click ssi le bouton cliquer est un bouton delete
     */
    document.getElementById("fav-list").addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-favori")) {
            let index = event.target.getAttribute("data-index");
            deleteFromFavoris(index);
        }
    });

    /**
     * Fonction gestion de la suppression d'un favori
     */
    function deleteFromFavoris(index) {
        let tabFavoritePlayer = JSON.parse(localStorage.getItem("Favorites Players")) || [];

        tabFavoritePlayer.splice(index, 1);

        // Mise à jour du localStorage
        localStorage.setItem("Favorites Players", JSON.stringify(tabFavoritePlayer));

        // Recharge l'affichage
        retrieveFromLocalStorage();
    }

    // Exécute la récupération des favoris au chargement de la page
    window.onload = retrieveFromLocalStorage;




});