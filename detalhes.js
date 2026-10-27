// Pega o ID que veio no endereço: detalhes.html?id=1
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get('id');

fetch(`http://localhost:3000/pokemon/${id}`)
    .then(resposta => resposta.json())
    .then(pokemon => {
        document.getElementById('pokemon-detalhes').innerHTML = `
            <div class="card card-detalhes tipo-${pokemon.types[0]?.name.toLowerCase() || 'normal'}">
                <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png"
                    alt="${pokemon.name}"
                    class="card-img-top"
                >

                <div class="card-body">
                    <p class="pokemon-id">
                        #${String(pokemon.id).padStart(3, '0')}
                    </p>
                    <h2 class="card-title">${pokemon.name}</h2>
                    <p class="card-text">HP: ${pokemon.stats.hp}</p>
                    <p class="card-text">Ataque: ${pokemon.stats.attack}</p>
                    <p class="card-text">Defesa: ${pokemon.stats.defense}</p>
                </div>
            </div>
            <div class="card card-detalhes card-status">
                <div class="card-body">
                    <h2 class="card-title">Atributos</h2>

                    <div class="area-grafico">
                        <canvas id="grafico-status"></canvas>
                    </div>
                </div>
            </div>
        `;

        new Chart(document.getElementById('grafico-status'), {
            type: 'radar',
            data: {
                labels: [
                    'HP', 'Ataque', 'Defesa',
                    'Ataque especial', 'Defesa especial', 'Velocidade'
                ],
                datasets: [{
                    label: pokemon.name,
                    data: [
                        pokemon.stats.hp,
                        pokemon.stats.attack,
                        pokemon.stats.defense,
                        pokemon.stats.specialAttack,
                        pokemon.stats.specialDefense,
                        pokemon.stats.speed
                    ],
                    backgroundColor: 'rgba(0, 220, 255, 0.3)',
                    borderColor: '#00dcff',
                    pointBackgroundColor: '#ffffff',
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    r: {
                        min: 0,
                        max: 255,
                        ticks: { display: false },
                        grid: { display: false },
                        angleLines: { color: 'rgba(255,255,255,0.3)' },
                        pointLabels: { color: 'white' }
                    }
                }
            }
        });
    });