const MAX_POKEMON = 151;
const pokemonList = document.querySelector(".pokemon-ul-list");
const searchInput = document.querySelector("#search");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector(".erro");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
    .then((response) => response.json())
    .then((data) => {
        allPokemons = data.results;
        displayPokemon(allPokemons)
    })

//carrega os dados antes de entrar na página de detalhes
async function fetchPokemonDataBeforeRedirect(id){

    try{
        const [pokemon, pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => 
            res.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => 
            res.json()
        )

    ])
    return true
    } catch(error){
        console.error("Failed to fetch pokemon data before redirect");
    }
}

function displayPokemon(pokemon){
    pokemonList.innerHTML = "";
    
    pokemon.forEach((pokemon) => {
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg"  alt="${pokemon.name}">
            <div class="details">
                <h2 id="name">${pokemon.name}</h2>
                <p class="id">${pokemonID}1</p>
            </div>
        `
        listItem.addEventListener("click", async () => {
            const succes = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (succes) {
                window.location.href = `./detail.html?id=${pokemonID}`
            }
        });
        pokemonList.appendChild(listItem);
    });
}