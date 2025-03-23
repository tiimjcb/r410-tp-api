import { getPlayerStats, addToFavorites, getFavorites, removeFavorite } from './model.js';
import { updateUIWithStats, clearMessages, showError, renderFavorites } from './view.js';

export function initController() {
    const playerInput = document.getElementById("player-name");
    const searchButton = document.getElementById("search-btn");
    const favButton = document.getElementById("fav-btn");

    const platformRadios = document.getElementsByName("platform");
    const timeWindowRadios = document.getElementsByName("time-window");

    function toggleSearchButton() {
        const isEmpty = playerInput.value.trim() === "";
        searchButton.disabled = isEmpty;
        favButton.disabled = isEmpty;
        searchButton.classList.toggle("disabled", isEmpty);
        favButton.classList.toggle("disabled", isEmpty);
    }

    function handleSearch() {
        clearMessages();

        const playerName = playerInput.value.trim();
        const plateforme = [...platformRadios].find(r => r.checked).value;
        const timeframe = [...timeWindowRadios].find(r => r.checked).value;

        searchButton.disabled = true;
        searchButton.textContent = "Chargement...";

        getPlayerStats(playerName, plateforme, timeframe)
            .then(stats => updateUIWithStats(stats))
            .catch(showError)
            .finally(() => {
                searchButton.disabled = false;
                searchButton.textContent = "Rechercher";
            });
    }

    function handleAddToFavorites() {
        const playerName = playerInput.value.trim();
        const plateforme = [...platformRadios].find(r => r.checked).value;
        const timeframe = [...timeWindowRadios].find(r => r.checked).value;

        getPlayerStats(playerName, plateforme, timeframe)
            .then(stats => {
                addToFavorites(stats, playerName, plateforme, timeframe);
                renderFavorites(getFavorites(), getPlayerStats);
            })
            .catch(showError)
            .finally(() => {
                favButton.disabled = false;
            });
    }

    function handleDelete(event) {
        if (event.target.classList.contains("delete-favori")) {
            const index = event.target.getAttribute("data-index");
            removeFavorite(index);
            renderFavorites(getFavorites(), getPlayerStats);
        }
    }

    function loadFavoritesOnStart() {
        renderFavorites(getFavorites(), getPlayerStats);
    }

    // Listeners
    playerInput.addEventListener("input", toggleSearchButton);
    searchButton.addEventListener("click", handleSearch);
    favButton.addEventListener("click", handleAddToFavorites);
    document.getElementById("fav-list").addEventListener("click", handleDelete);
    window.onload = loadFavoritesOnStart;
    toggleSearchButton();


    document.getElementById("fav-list").addEventListener("click", function (event) {
        if (event.target.classList.contains("fav-name")) {
            const index = event.target.getAttribute("data-index");
            const favorites = getFavorites();
            const selected = favorites[index];

            if (selected) {
                document.getElementById("player-name").value = selected.playerName;

                [...platformRadios].forEach(radio => {
                    radio.checked = radio.value === selected.plateforme;
                });

                [...timeWindowRadios].forEach(radio => {
                    radio.checked = radio.value === selected.timeframe;
                });

                toggleSearchButton();
            }
        }
    });

}