fetch('http://localhost:3000/pokemon')
    .then(resposta => resposta.json())
    .then(pokemons => {
        const container = document.getElementById('pokemon-container');

        pokemons.forEach(pokemon => {
            container.innerHTML += `
                <div class="col-6 col-md-3 col-lg-2 mb-3">
                    <div class="card tipo-${pokemon.types[0]?.name.toLowerCase() || 'normal'}"
                        onclick="window.open('detalhes.html?id=${pokemon.id}', '_blank')">
                        
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" class="card-img-top" alt="${pokemon.name}">

                        <div class="card-body">
                            <p class="pokemon-id mb-1">#${String(pokemon.id).padStart(3, '0')}</p>
                            <h2 class="card-title">${pokemon.name}</h2>
                            <p class="card-text"> ${pokemon.types.map(tipo => `
                                <span class="tipo-etiqueta">${tipo.name}</span>
                                `).join('')} </p>
                        </div>
                    </div>
                </div>
            `;
        });
    });