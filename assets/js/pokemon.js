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
                <p class="id">${pokemonID}</p>
            </div>
        `
        listItem.addEventListener("click", async () => {
            const succes = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (succes) {
                window.location.href = `./detail.html?id=${pokemonID}`;
    
            }
        });
        notFoundMessage.style.display = "none";
        pokemonList.appendChild(listItem);
    });
}


// Função para buscar Pokémon por id ou nome
function searchPokemon(query) {
    const searchTerm = query.toLowerCase();
    const foundPokemons = allPokemons.filter((pokemon) => {
        const pokemonID = parseInt(pokemon.url.split("/")[6]);
        return pokemonID === parseInt(searchTerm) || pokemon.name.toLowerCase().includes(searchTerm);
    });

    // Verifica se algum Pokémon foi encontrado
    if (foundPokemons.length > 0) {
        displayPokemon(foundPokemons);
        notFoundMessage.style.display = "none"; // Oculta a mensagem de "não encontrado"
    } else {
        // Se nenhum Pokémon foi encontrado, exibe a mensagem de "não encontrado"
        displayPokemon([]); // Limpa a lista de Pokémon
        notFoundMessage.style.display = "flex";
    }
}

// Adiciona um evento de tecla ao campo de pesquisa
searchInput.addEventListener('keyup', handleSearch);

function handleSearch() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        searchPokemon(searchTerm);
    } else {
        // Se a caixa de pesquisa estiver vazia, exibe todos os Pokémon
        displayPokemon(allPokemons);
    }
}