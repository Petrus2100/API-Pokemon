document.addEventListener('DOMContentLoaded', () => {
    const pokemonListElement = document.getElementById('pokemon-lista');
    const modal = document.getElementById('modal');
    const span = document.getElementsByClassName('close')[0];
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'; 

    async function fetchJSON(url) {
        const response = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error(`Failed to fetch data from ${url}`);
        return await response.json();
    }

    function createPokemonElement(pokemon) {
        const li = document.createElement('li');
        li.classList.add('pokemon');
        li.innerHTML = `
            <div>
                <strong>${pokemon.name}</strong><br>
                <img src="${pokemon.image}" alt="Imagem de ${pokemon.name}" />
            </div>`;
        li.querySelector('img').addEventListener('click', () => mostrarDetalhesPokemon(pokemon.url));
        return li;
    }

    async function fetchPokemon() {
        try {
            const data = await fetchJSON(url);
            const pokemons = data.results;
            for (const pokemon of pokemons) {
                const details = await fetchJSON(pokemon.url);
                pokemon.image = details.sprites.front_default;
                pokemonListElement.appendChild(createPokemonElement(pokemon));
            }
        } catch (error) {
            console.error('Erro ao buscar Pokémon:', error);
        }
    }

    async function mostrarDetalhesPokemon(url) {
        try {
            const data = await fetchJSON(url);
            const name = data.name;
            const height = data.height / 10; 
            const weight = data.weight / 10; 
            const types = data.types.map(type => type.type.name).join(', ');
            const abilities = data.abilities.map(ability => ability.ability.name).join(', ');

            document.getElementById('nome').textContent = name.toUpperCase();
            document.getElementById('altura').textContent = `${height} m`;
            document.getElementById('peso').textContent = `${weight} kg`;
            document.getElementById('tipos').textContent = types;
            document.getElementById('habilidades').textContent = abilities;
            document.getElementById('imagem').src = data.sprites.front_default;

            modal.style.display = 'block';
            span.onclick = () => { modal.style.display = 'none'; };
            window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };
        } catch (error) {
            console.error('Erro ao buscar detalhes do Pokémon:', error);
        }
    }

    fetchPokemon();

    fetch('http://localhost/backend/pokemons', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Pokémons do backend:', data);
    })
    .catch(error => console.log('Erro ao buscar dados do backend:', error));

    const pokemon = {
        nome: "Pikachu",
        tipo: "Elétrico",
        imagem: "https://example.com/pikachu.jpg",
        peso: 6.0,
        altura: 0.4
    };

    fetch('http://localhost/backend/pokemons', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pokemon)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Pokémon adicionado com sucesso:', data);
    })
    .catch(error => console.log('Erro ao adicionar Pokémon:', error));
});
