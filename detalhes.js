// Pega o ID que veio no endereço: detalhes.html?id=1
const parametros = new URLSearchParams(window.location.search);
const id = parametros.get('id');
const iconesTipos = {
    Normal: 'images/Pokémon_Normal_Type_Icon.svg.png',
    Fire: 'images/Type_Fire_HOME.png',
    Water: 'images/Pokémon_Water_Type_Icon.svg.png',
    Grass: 'images/grass.png',
    Electric: 'images/Pokémon_Electric_Type_Icon.svg.png',
    Ice: 'images/Pokémon_Ice_Type_Icon.svg.png',
    Fighting: 'images/fighting.png',
    Poison: 'images/Pokémon_Poison_Type_Icon.svg.png',
    Ground: 'images/Pokémon_Ground_Type_Icon.svg.png',
    Flying: 'images/flying.png',
    Psychic: 'images/Pokémon_Psychic_Type_Icon.svg.png',
    Bug: 'images/bug.png',
    Rock: 'images/rock.png',
    Ghost: 'images/ghost_type_symbol_galar_by_jormxdos_dffvl2d-fullview.png',
    Dark: 'images/darkness_type_symbol_tcg_by_jormxdos_dfgddck-fullview.png',
    Dragon: 'images/dragon_type_symbol_tcg_by_jormxdos_dfgddc1-fullview.png',
    Steel: 'images/Pokémon_Steel_Type_Icon.svg.png'
};

function criarLinhaEvolutiva(pokemon) {
    const evolucoes = pokemon.evolutions || [];
    if (!evolucoes.length) {
        return `
            <div class="sem-evolucao">
                <p class="mensagem-sem-evolucao">Sem outros estágios</p>
                <img src="images/Ícone de Poké Bola Branca Transparente.png"
                    alt="Sem linha evolutiva neste Pokédex" width="120" height="120">
            </div>
        `;
    }

    const criarLink = evolucao => `
        <a class="evolucao ${evolucao.id === pokemon.id ? 'evolucao-atual' : ''}"
            href="detalhes.html?id=${evolucao.id}"
            ${evolucao.id === pokemon.id ? 'aria-current="page"' : ''}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolucao.id}.png"
                alt="" width="48" height="48">
            <span>${evolucao.name}</span>
        </a>
    `;
    const seta = '<span class="seta-evolucao" aria-hidden="true">→</span>';
    const alternativas = evolucoes.filter(evolucao => evolucao.evolvesFromId != null);

    const conteudo = alternativas.length > 1
        ? `${criarLink(evolucoes[0])}${seta}
            <div class="evolucoes-alternativas" role="group" aria-label="Evoluções alternativas">
                ${alternativas.map(criarLink).join('')}
            </div>`
        : evolucoes.map(criarLink).join(seta);

    return `
        <nav class="familia-evolutiva" aria-label="Linha evolutiva">
            <h3>Linha evolutiva</h3>
            <div class="linha-evolutiva">${conteudo}</div>
        </nav>
    `;
}

fetch(`http://localhost:3000/pokemon/${id}`)
    .then(resposta => resposta.json())
    .then(pokemon => {
        document.getElementById('pokemon-detalhes').innerHTML = `
            <div class="card card-detalhes card-pokemon tipo-${pokemon.types[0]?.name.toLowerCase() || 'normal'}">
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
                    ${criarLinhaEvolutiva(pokemon)}
                </div>
            </div>
            <div class="card card-detalhes card-tipos">
                <div class="card-body">
                    <h2 class="card-title">Tipo</h2>

                    <div class="lista-tipos">
                        ${pokemon.types.map(tipo => `
                            <div class="tipo-item">
                                <img
                                    src="${iconesTipos[tipo.name]}"
                                    alt="Símbolo do tipo ${tipo.name}"
                                    class="tipo-icone"
                                >
                                <span class="tipo-etiqueta">${tipo.name}</span>
                            </div>
                        `).join('')}
                    </div>
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
            <div class="card card-detalhes card-valores tipo-${pokemon.types[0]?.name.toLowerCase() || 'normal'}">
                <div class="card-body">
                    <h2 class="card-title">Estatísticas</h2>
                    <div class="grafico-barras" aria-label="Estatísticas com escala de 0 a 200">
                        ${[
                            ['HP', pokemon.stats.hp],
                            ['Ataque', pokemon.stats.attack],
                            ['Defesa', pokemon.stats.defense],
                            ['Ataque especial', pokemon.stats.specialAttack],
                            ['Defesa especial', pokemon.stats.specialDefense],
                            ['Velocidade', pokemon.stats.speed]
                        ].map(([nome, valor]) => `
                            <div class="atributo">
                                <span class="atributo-valor">${valor}</span>
                                <div class="barra-fundo">
                                    <div
                                        class="barra-valor"
                                        style="height: ${Math.min((valor / 200) * 100, 100)}%"
                                    ></div>
                                </div>
                                <span class="atributo-nome">${nome}</span>
                            </div>
                        `).join('')}
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
