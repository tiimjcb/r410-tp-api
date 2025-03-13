document.addEventListener("DOMContentLoaded", () => {
    const playerInput = document.getElementById("player-name");
    const searchButton = document.getElementById("search-btn");
    const favButton = document.getElementById("fav-btn");

    const API_URL = "https://fortnite-api.com/v2/stats/br/v2";
    const API_KEY = "6f3cdb97-1f92-4afb-b450-8870cc218abf"


    function toggleSearchButton() {
        if (playerInput.value.trim() === "") {
            searchButton.disabled = true;
            searchButton.classList.add("disabled");

            favButton.disabled = true;
            favButton.classList.add("disabled");
        } else {
            searchButton.disabled = false;
            searchButton.classList.remove("disabled");

            favButton.disabled = false;
            favButton.classList.remove("disabled");
        }
    }

    async function getPlayerStats(playerName, plateforme, timeframe) {
        const validPlatforms = ["pc", "psn", "xbox"];
        const validTimeframes = ["season", "lifetime"];

        if (!validPlatforms.includes(plateforme.toLowerCase())) {
            console.error(`Plateforme invalide : "${plateforme}". Doit être "pc", "psn" ou "xbox".`);
            return null;
        }

        if (!validTimeframes.includes(timeframe.toLowerCase())) {
            console.error(`Timeframe invalide : "${timeframe}". Doit être "season" ou "lifetime".`);
            return null;
        }

        try {
            const response = await fetch(`${API_URL}?name=${playerName}&accountType=${plateforme.toLowerCase()}&timeWindow=${timeframe.toLowerCase()}`, {
                headers: {
                    "Authorization": API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();

            const playerStats = {
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
            };

            console.log("Statistiques filtrées du joueur :", playerStats);
            return playerStats;

        } catch (error) {
            console.error("Erreur lors de la récupération des stats :", error);
            return null;
        }
    }

    toggleSearchButton();
    playerInput.addEventListener("input", toggleSearchButton);


});

