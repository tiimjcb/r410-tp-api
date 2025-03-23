const API_URL = "https://fortnite-api.com/v2/stats/br/v2";
const API_KEY = "6f3cdb97-1f92-4afb-b450-8870cc218abf";

export function getPlayerStats(playerName, plateforme, timeframe) {
    const validPlatforms = ["epic", "psn", "xbl"];
    const validTimeframes = ["season", "lifetime"];

    plateforme = plateforme.toLowerCase();
    timeframe = timeframe.toLowerCase();

    if (!validPlatforms.includes(plateforme)) {
        console.error(`Plateforme invalide : "${plateforme}".`);
        return Promise.reject("Paramètre plateforme invalide");
    }

    if (!validTimeframes.includes(timeframe)) {
        console.error(`Timeframe invalide : "${timeframe}".`);
        return Promise.reject("Paramètre timeframe invalide");
    }

    return fetch(`${API_URL}?name=${playerName}&accountType=${plateforme}&timeWindow=${timeframe}`, {
        headers: { "Authorization": API_KEY }
    })
        .then(response => {
            if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
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

// Favoris (add / get / delete)
export function addToFavorites(stats, playerName, plateforme, timeframe) {
    let tabFavoritePlayer = JSON.parse(localStorage.getItem("Favorites Players")) || [];

    if (!tabFavoritePlayer.some(player => player.name === stats.name)) {
        let updateStats = { ...stats, playerName, plateforme, timeframe };
        tabFavoritePlayer.push(updateStats);
    }

    localStorage.setItem("Favorites Players", JSON.stringify(tabFavoritePlayer));
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem("Favorites Players")) || [];
}

export function removeFavorite(index) {
    let tabFavoritePlayer = getFavorites();
    tabFavoritePlayer.splice(index, 1);
    localStorage.setItem("Favorites Players", JSON.stringify(tabFavoritePlayer));
}