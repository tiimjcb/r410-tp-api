export function updateUIWithStats(stats) {
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
    document.getElementById("minutes-played").querySelector(".number").textContent = Math.round(stats.minutesPlayed / 60);
}

export function clearMessages() {
    document.querySelector(".info").classList.add("hidden");
    document.getElementById("response-error").classList.add("hidden");
    document.getElementById("response-valid").classList.add("hidden");
}

export function showError() {
    document.getElementById("response-error").classList.remove("hidden");
}

export function renderFavorites(favorites, getPlayerStats) {
    const favContainer = document.getElementById("fav-container");
    const favList = document.getElementById("fav-list");

    favList.innerHTML = "";

    if (favorites.length === 0) {
        favContainer.classList.add("hidden");
        return;
    }

    favContainer.classList.remove("hidden");

    favorites.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.classList.add("favorite-player");
        playerDiv.setAttribute("data-index", index);
        playerDiv.innerHTML = `
            <div class="favorite-title">
                <h3 class="fav-name" data-index="${index}">${player.name}</h3>
                <button class="delete-favori" data-index="${index}">❌</button>            
            </div>
            <p><strong>KD :</strong> Chargement...</p>
            <p><strong>Victoires:</strong> Chargement...</p>
        `;

        favList.appendChild(playerDiv);

        getPlayerStats(player.name, player.plateforme, player.timeframe)
            .then(stats => {
                playerDiv.querySelector("p:last-of-type").innerHTML = `<strong>Victoires:</strong> ${stats.wins}`;
                playerDiv.querySelector("p:first-of-type").innerHTML = `<strong>KD :</strong> ${stats.kd}`;
            });
    });
}