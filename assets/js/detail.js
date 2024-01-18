// Função para extrair parâmetros da URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Obtém parâmetros da URL
const pokemonId = getParameterByName("id");
const pokemonName = getParameterByName("name");

const pokemonImage = getParameterByName("photo");

// Preenche os elementos HTML com os detalhes do Pokémon
document.getElementById("name").textContent = pokemonName;
document.getElementById("id").textContent = pokemonId;

document.getElementById("foto_pokemon").src = pokemonImage;