document.addEventListener("DOMContentLoaded", () => {
    const playerInput = document.getElementById("player-name");
    const searchButton = document.getElementById("search-btn");
    const favButton = document.getElementById("fav-btn");

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


    toggleSearchButton();

    playerInput.addEventListener("input", toggleSearchButton);
});