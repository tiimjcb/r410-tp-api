document.addEventListener("DOMContentLoaded", () => {
    const playerInput = document.getElementById("player-name");
    const searchButton = document.getElementById("search-btn");
    const searchContainer = document.getElementById("search-container");
    const responseContainer = document.getElementById("response-container");

    function toggleSearchButton() {
        if (playerInput.value.trim() === "") {
            searchButton.disabled = true;
            searchButton.classList.add("disabled");
        } else {
            searchButton.disabled = false;
            searchButton.classList.remove("disabled");
        }
    }

    toggleSearchButton();

    playerInput.addEventListener("input", toggleSearchButton);
});