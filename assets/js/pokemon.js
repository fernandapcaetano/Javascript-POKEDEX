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
async function fetchPokemonDataBeforeRedirect(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json())
        ]);

        // Retorna os dados do Pokémon e da espécie
        return { pokemon, pokemonSpecies };
    } catch (error) {
        console.error("Failed to fetch pokemon data before redirect");
        return null;
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
                <a href ="#"> Ver mais </a>
            </div>
        `
        listItem.addEventListener("click", async () => {
            const data = await fetchPokemonDataBeforeRedirect(pokemonID);
            if (data) {
                const { pokemon, pokemonSpecies } = data;
        
                // Redireciona para detail.html com parâmetros necessários
                window.location.href = `./detail.html?id=${pokemonID}&name=${pokemon.name}&photo=${pokemon.sprites.other.dream_world.front_default}`;
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


document.querySelectorAll('.sort_option input[type="radio"]').forEach((radio) => {
    radio.addEventListener('click', handleFilterClick);
});

function handleFilterClick() {
    // Recupera a preferência de ordenação do usuário
    const sortOrder = getSortOrder();

    // Ordena a lista de Pokémon com base na preferência do usuário
    const sortedPokemons = sortPokemons(allPokemons, sortOrder);

    // Exibe a lista ordenada
    displayPokemon(sortedPokemons);
}

// Função para recuperar a preferência de ordenação do usuário
function getSortOrder() {
    if (numberFilter.checked) {
        return "number";
    } else if (nameFilter.checked) {
        return "name";
    } else {
        return ""; // ou outro valor padrão, se necessário
    }
}

// Função para ordenar a lista de Pokémon com base na preferência do usuário
function sortPokemons(pokemons, sortOrder) {
    if (sortOrder === "number") {
        return [...pokemons].sort((a, b) => parseInt(a.url.split("/")[6]) - parseInt(b.url.split("/")[6]));
    } else if (sortOrder === "name") {
        return [...pokemons].sort((a, b) => a.name.localeCompare(b.name));
    } else {
        return pokemons; // Se nenhum filtro estiver selecionado, retorna a lista sem alterações
    }
}

