let statisticsData = {
    suits: {},
    elements: {},
    planets: {},
    signs: {}, // ← AGREGAR ESTA LÍNEA
    cards: {},
    orientations: { upright: 0, reversed: 0 },
    totalEntries: 0,
    mostFrequentCard: { name: "", count: 0 }
};

        // Variables para estadísticas
        let currentPeriod = 'all'; // 'all', 'month', 'week', 'custom'
        let customPeriodData = null;

        // Inicializar estadísticas cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', function() {
            initializeStatistics();
        });

function getElementFromSuit(suit) {
    const suitToElement = {
        'Wands': 'Fire',
        'Cups': 'Water', 
        'Swords': 'Air',
        'Pentacles': 'Earth'
    };
    return suitToElement[suit] || null;
}

function getElementFromCourtRank(cardName) {
    if (cardName.includes('Page')) return 'Earth';
    if (cardName.includes('Knight')) return 'Air';
    if (cardName.includes('Queen')) return 'Water';
    if (cardName.includes('King')) return 'Fire';
    return null;
}

function initializeStatistics() {
    console.log('Inicializando estadísticas...');
    console.log('Total de entradas en historial:', logHistory.length);
    
    setupStatisticsEvents();
    calculateStatistics();
    
    // Verificar que los elementos del modal existan
    const modal = document.getElementById('period-selector-modal');
    if (!modal) {
        console.error('Modal de período personalizado no encontrado en el DOM');
    } else {
        console.log('Modal de período personalizado encontrado');
    }
}

// Y modifica calculateStatistics para que no llame a initializeCharts duplicadamente:
function calculateStatistics() {
    console.log('Calculando estadísticas para período:', currentPeriod, customPeriodData);
    
    const filteredEntries = filterEntriesByPeriod(logHistory, currentPeriod, customPeriodData);
    console.log('Entradas filtradas:', filteredEntries.length);
    
    calculateBasicStats(filteredEntries);
    updateCustomPeriodOptions();
    displayStatistics();
    
    // Actualizar gráficos si la función existe
    if (typeof updateCharts === 'function') {
        updateCharts();
    }
    
    // Mostrar información del período actual
    let periodInfo = '';
    if (currentPeriod === 'custom' && customPeriodData) {
        const { type, year, month, week } = customPeriodData;
        if (type === 'year') periodInfo = `Año ${year}`;
        else if (type === 'month') periodInfo = `${getMonthName(month)} ${year}`;
        else if (type === 'week') periodInfo = `Semana ${week} de ${year}`;
    } else {
        periodInfo = currentPeriod;
    }
    
    console.log('Período actual:', periodInfo);
    console.log('Estadísticas calculadas:', statisticsData);
}


function setupStatisticsEvents() {
    console.log('Configurando eventos de estadísticas');
    
    // Botones de períodos predefinidos
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            console.log('Período seleccionado:', period);
            
            if (period === 'custom') {
                showPeriodSelector();
            } else {
                currentPeriod = period;
                customPeriodData = null;
                calculateStatistics();
            }
        });
    });

    // Cerrar modal haciendo clic fuera del contenido
    const modal = document.getElementById('period-selector-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hidePeriodSelector();
            }
        });
    }
    
    // También agregar evento para tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hidePeriodSelector();
        }
    });
}

function calculateBasicStats(entries) {
    const dailyEntries = entries.filter(entry => entry.entry_type === 'daily');
    
    statisticsData.totalEntries = dailyEntries.length;
    statisticsData.orientations = { upright: 0, reversed: 0 };
    const uniqueCards = new Set();
    const cardCounts = {};
    
    // Reiniciar contadores CORREGIDOS
    statisticsData.suits = { 
        'Major Arcana': 0, 
        'Wands': 0, 
        'Cups': 0, 
        'Swords': 0, 
        'Pentacles': 0,
        'Court Cards': 0
    };
    statisticsData.elements = { 'Fire': 0, 'Water': 0, 'Air': 0, 'Earth': 0 };
    statisticsData.planets = { 
        'Sun': 0, 'Moon': 0, 'Mercury': 0, 'Venus': 0, 
        'Mars': 0, 'Jupiter': 0, 'Saturn': 0 
    };
    statisticsData.signs = { // ← AGREGAR INICIALIZACIÓN DE SIGNOS
        'Aries': 0, 'Taurus': 0, 'Gemini': 0, 'Cancer': 0,
        'Leo': 0, 'Virgo': 0, 'Libra': 0, 'Scorpio': 0,
        'Sagittarius': 0, 'Capricorn': 0, 'Aquarius': 0, 'Pisces': 0
    };
    
    dailyEntries.forEach(entry => {
        if (entry.tarot_card) {
            // Contar orientaciones
            if (entry.tarot_orientation === 'reversed') {
                statisticsData.orientations.reversed++;
            } else {
                statisticsData.orientations.upright++;
            }
            
            // Contar cartas únicas
            if (entry.tarot_card.ID) {
                uniqueCards.add(entry.tarot_card.ID);
            }
            
            // Contar frecuencia de cartas
            const cardName = entry.tarot_card.Name || 'Unknown';
            if (cardCounts[cardName]) {
                cardCounts[cardName]++;
            } else {
                cardCounts[cardName] = 1;
            }
            
            const card = entry.tarot_card;
            const cardSuit = card.Suit || '';
            
            // Detectar si es carta de corte
            const isCourtCard = cardName.includes('Page') || 
                               cardName.includes('Knight') || 
                               cardName.includes('Queen') || 
                               cardName.includes('King');
            
            // Detectar si es arcano mayor
            const isMajorArcana = cardSuit === 'Major Arcana' || cardSuit === 'Majors';
            
            // ← AGREGAR ESTA LÓGICA DE CLASIFICACIÓN QUE FALTABA
            if (isCourtCard) {
                statisticsData.suits['Court Cards']++;
            } else if (isMajorArcana) {
                statisticsData.suits['Major Arcana']++;
            } else {
                // Es arcano menor - clasificar por palo
                switch(cardSuit) {
                    case 'Wands':
                        statisticsData.suits['Wands']++;
                        break;
                    case 'Cups':
                        statisticsData.suits['Cups']++;
                        break;
                    case 'Swords':
                        statisticsData.suits['Swords']++;
                        break;
                    case 'Pentacles':
                        statisticsData.suits['Pentacles']++;
                        break;
                    default:
                        statisticsData.suits['Major Arcana']++;
                }
            }
            
            // ELEMENTOS
            if (!isCourtCard) {
                let element = card.Element || '';
                
                if (!element && !isMajorArcana && cardSuit) {
                    const suitToElement = {
                        'Wands': 'Fire',
                        'Cups': 'Water', 
                        'Swords': 'Air',
                        'Pentacles': 'Earth'
                    };
                    element = suitToElement[cardSuit] || '';
                }
                
                if (element && statisticsData.elements.hasOwnProperty(element)) {
                    statisticsData.elements[element]++;
                }
            } else {
                // Para court cards, contar ambos elementos
                const suitElement = getElementFromSuit(cardSuit);
                if (suitElement) {
                    statisticsData.elements[suitElement]++;
                }
                
                const rankElement = getElementFromCourtRank(cardName);
                if (rankElement) {
                    statisticsData.elements[rankElement]++;
                }
            }
            
            // PLANETAS - solo para no court cards
            if (!isCourtCard && card.Planet && statisticsData.planets.hasOwnProperty(card.Planet)) {
                statisticsData.planets[card.Planet]++;
            }
            
            // SIGNOS - solo para no court cards ← AGREGAR ESTA LÓGICA
            if (!isCourtCard && card.Sign && statisticsData.signs.hasOwnProperty(card.Sign)) {
                statisticsData.signs[card.Sign]++;
            }
        }
    });
    
    statisticsData.uniqueCardsCount = uniqueCards.size;
    
    // Encontrar la carta más frecuente
    let mostFrequentCard = { name: "", count: 0 };
    for (const [cardName, count] of Object.entries(cardCounts)) {
        if (count > mostFrequentCard.count) {
            mostFrequentCard.name = cardName;
            mostFrequentCard.count = count;
        }
    }
    
    statisticsData.mostFrequentCard = mostFrequentCard;
}

function displayMostFrequentCard() {
    const mostFrequent = statisticsData.mostFrequentCard;
    document.getElementById('most-frequent-name').textContent = mostFrequent.name || "-";
    document.getElementById('most-frequent-count').textContent = 
        `Apareció ${mostFrequent.count} vez${mostFrequent.count !== 1 ? 'es' : ''}`;
}

// ACTUALIZAR la función displayStatistics
function displayStatistics() {
    displayBasicStats();
    displaySuitsPercentages();
    displayElementsPercentages();
    displayPlanetsPercentages();
    displaySignsPercentages(); // ← Agregar esta línea
        displayMostFrequentCard(); // ← NUEVA LLAMADA

}



// Función auxiliar para nombres de meses
function getMonthName(month) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || '';
}

// ===== FUNCIONES DE ESTADÍSTICAS DETALLADAS =====
// AGREGAR función para mostrar estadísticas de signos
function displaySignsPercentages() {
    // Calcular total excluyendo cartas de corte
    const totalForSigns = statisticsData.totalEntries - statisticsData.suits['Court Cards'];
    
    if (totalForSigns === 0) return;
    
    // Actualizar todos los signos
    document.getElementById('aries-percent').textContent = 
        Math.round((statisticsData.signs['Aries'] / totalForSigns) * 100) + '%';
    document.getElementById('taurus-percent').textContent = 
        Math.round((statisticsData.signs['Taurus'] / totalForSigns) * 100) + '%';
    document.getElementById('gemini-percent').textContent = 
        Math.round((statisticsData.signs['Gemini'] / totalForSigns) * 100) + '%';
    document.getElementById('cancer-percent').textContent = 
        Math.round((statisticsData.signs['Cancer'] / totalForSigns) * 100) + '%';
    document.getElementById('leo-percent').textContent = 
        Math.round((statisticsData.signs['Leo'] / totalForSigns) * 100) + '%';
    document.getElementById('virgo-percent').textContent = 
        Math.round((statisticsData.signs['Virgo'] / totalForSigns) * 100) + '%';
    document.getElementById('libra-percent').textContent = 
        Math.round((statisticsData.signs['Libra'] / totalForSigns) * 100) + '%';
    document.getElementById('scorpio-percent').textContent = 
        Math.round((statisticsData.signs['Scorpio'] / totalForSigns) * 100) + '%';
    document.getElementById('sagittarius-percent').textContent = 
        Math.round((statisticsData.signs['Sagittarius'] / totalForSigns) * 100) + '%';
    document.getElementById('capricorn-percent').textContent = 
        Math.round((statisticsData.signs['Capricorn'] / totalForSigns) * 100) + '%';
    document.getElementById('aquarius-percent').textContent = 
        Math.round((statisticsData.signs['Aquarius'] / totalForSigns) * 100) + '%';
    document.getElementById('pisces-percent').textContent = 
        Math.round((statisticsData.signs['Pisces'] / totalForSigns) * 100) + '%';
}

function displayElementsPercentages() {
    // Calcular total de "apariciones elementales" (puede ser mayor que totalEntries)
    const totalElementAppearances = 
        Object.values(statisticsData.elements).reduce((sum, count) => sum + count, 0);
    
    if (totalElementAppearances === 0) return;
    
    document.getElementById('fire-percent').textContent = 
        Math.round((statisticsData.elements['Fire'] / totalElementAppearances) * 100) + '%';
    document.getElementById('water-percent').textContent = 
        Math.round((statisticsData.elements['Water'] / totalElementAppearances) * 100) + '%';
    document.getElementById('air-percent').textContent = 
        Math.round((statisticsData.elements['Air'] / totalElementAppearances) * 100) + '%';
    document.getElementById('earth-percent').textContent = 
        Math.round((statisticsData.elements['Earth'] / totalElementAppearances) * 100) + '%';
    
    console.log('Total apariciones elementales:', totalElementAppearances);
    console.log('Distribución elementos:', statisticsData.elements);
}

function displaySuitsPercentages() {
    const total = statisticsData.totalEntries;
    if (total === 0) return;
    
    // Calcular porcentajes
    const majorPercent = Math.round((statisticsData.suits['Major Arcana'] / total) * 100);
    const wandsPercent = Math.round((statisticsData.suits['Wands'] / total) * 100);
    const cupsPercent = Math.round((statisticsData.suits['Cups'] / total) * 100);
    const swordsPercent = Math.round((statisticsData.suits['Swords'] / total) * 100);
    const pentaclesPercent = Math.round((statisticsData.suits['Pentacles'] / total) * 100);
    const courtPercent = Math.round((statisticsData.suits['Court Cards'] / total) * 100);
    
    // Actualizar la interfaz
    document.getElementById('major-arcana-percent').textContent = majorPercent + '%';
    document.getElementById('wands-percent').textContent = wandsPercent + '%';
    document.getElementById('cups-percent').textContent = cupsPercent + '%';
    document.getElementById('swords-percent').textContent = swordsPercent + '%';
    document.getElementById('pentacles-percent').textContent = pentaclesPercent + '%';
    document.getElementById('court-cards-percent').textContent = courtPercent + '%';
    
    // Verificación de suma
    const sumCounts = Object.values(statisticsData.suits).reduce((a, b) => a + b, 0);
    const sumPercents = majorPercent + wandsPercent + cupsPercent + swordsPercent + pentaclesPercent + courtPercent;
    
    console.log('=== VERIFICACIÓN ===');
    console.log('Total entradas:', total);
    console.log('Suma conteos:', sumCounts);
    console.log('Suma porcentajes:', sumPercents + '%');
    
    if (sumCounts !== total) {
        console.warn('¡ADVERTENCIA! La suma de categorías no coincide con el total.');
        console.warn(`Total: ${total}, Suma categorías: ${sumCounts}, Diferencia: ${total - sumCounts}`);
    }
    
    if (sumPercents < 95 || sumPercents > 105) {
        console.warn('¡ADVERTENCIA! Los porcentajes no suman ~100%:', sumPercents + '%');
    }
}
function displayPlanetsPercentages() {
    // Calcular total excluyendo cartas de corte
    const totalForPlanets = statisticsData.totalEntries - statisticsData.suits['Court Cards'];
    
    if (totalForPlanets === 0) return;
    
    document.getElementById('sun-percent').textContent = 
        Math.round((statisticsData.planets['Sun'] / totalForPlanets) * 100) + '%';
    document.getElementById('moon-percent').textContent = 
        Math.round((statisticsData.planets['Moon'] / totalForPlanets) * 100) + '%';
    document.getElementById('mercury-percent').textContent = 
        Math.round((statisticsData.planets['Mercury'] / totalForPlanets) * 100) + '%';
    document.getElementById('venus-percent').textContent = 
        Math.round((statisticsData.planets['Venus'] / totalForPlanets) * 100) + '%';
    document.getElementById('mars-percent').textContent = 
        Math.round((statisticsData.planets['Mars'] / totalForPlanets) * 100) + '%';
    document.getElementById('jupiter-percent').textContent = 
        Math.round((statisticsData.planets['Jupiter'] / totalForPlanets) * 100) + '%';
    document.getElementById('saturn-percent').textContent = 
        Math.round((statisticsData.planets['Saturn'] / totalForPlanets) * 100) + '%';
}

function filterEntriesByPeriod(entries, period, customData) {
    console.log('Filtrando entradas por período:', period, customData);
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentWeek = getWeekNumber(now);
    
    // Solo filtrar entradas diarias
    const dailyEntries = entries.filter(entry => entry.entry_type === 'daily');
    
    if (period === 'custom' && customData) {
        // Filtrar por período personalizado
        const { type, year, month, week } = customData;
        
        return dailyEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            const entryYear = entryDate.getFullYear();
            const entryMonth = entryDate.getMonth() + 1;
            const entryWeek = getWeekNumber(entryDate);
            
            if (type === 'year') {
                return entryYear === year;
            } else if (type === 'month') {
                return entryYear === year && entryMonth === month;
            } else if (type === 'week') {
                return entryYear === year && entryWeek === week;
            }
            
            return true;
        });
    }
    
    // Filtrar por períodos predefinidos
    return dailyEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const entryYear = entryDate.getFullYear();
        const entryMonth = entryDate.getMonth() + 1;
        const entryWeek = getWeekNumber(entryDate);
        
        switch (period) {
            case 'month':
                return entryYear === currentYear && entryMonth === currentMonth;
            case 'week':
                return entryYear === currentYear && entryWeek === currentWeek;
            default: // 'all'
                return true;
        }
    });
}
// ===== FUNCIONES DEL MODAL DE PERÍODO PERSONALIZADO =====

function showPeriodSelector() {
    console.log('Mostrando selector de período personalizado');
    const modal = document.getElementById('period-selector-modal');
    if (!modal) {
        console.error('Modal no encontrado en el DOM');
        return;
    }
    modal.style.display = 'flex';
    updateCustomPeriodOptions();
}

function hidePeriodSelector() {
    const modal = document.getElementById('period-selector-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function applyCustomPeriod() {
    const periodType = document.getElementById('custom-period-type').value;
    const year = parseInt(document.getElementById('custom-year').value);
    const month = periodType === 'month' ? parseInt(document.getElementById('custom-month').value) : null;
    const week = periodType === 'week' ? parseInt(document.getElementById('custom-week').value) : null;
    
    if (!year) {
        alert('Por favor selecciona un año válido');
        return;
    }
    
    customPeriodData = {
        type: periodType,
        year: year,
        month: month,
        week: week
    };
    
    currentPeriod = 'custom';
    
    // Actualizar botones activos
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-period') === 'custom') {
            btn.classList.add('active');
        }
    });
    
    hidePeriodSelector();
    calculateStatistics();
    
    console.log('Período personalizado aplicado:', customPeriodData);
}

function updateCustomPeriodOptions() {
    const yearSelect = document.getElementById('custom-year');
    const monthContainer = document.getElementById('custom-month-container');
    const weekContainer = document.getElementById('custom-week-container');
    const periodType = document.getElementById('custom-period-type').value;
    
    if (!yearSelect) {
        console.error('Elemento custom-year no encontrado');
        return;
    }
    
    // Obtener años disponibles de las entradas
    const years = new Set();
    logHistory.forEach(entry => {
        const entryDate = new Date(entry.date);
        const year = entryDate.getFullYear();
        years.add(year);
    });
    
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    yearSelect.innerHTML = '';
    
    if (sortedYears.length === 0) {
        // Si no hay datos, usar años recientes
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 5; i--) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            yearSelect.appendChild(option);
        }
    } else {
        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    }
    
    // Mostrar/ocultar opciones según el tipo de período
    if (periodType === 'month') {
        monthContainer.style.display = 'flex';
        weekContainer.style.display = 'none';
    } else if (periodType === 'week') {
        monthContainer.style.display = 'none';
        weekContainer.style.display = 'flex';
        updateWeekOptions();
    } else {
        monthContainer.style.display = 'none';
        weekContainer.style.display = 'none';
    }
}

function updateWeekOptions() {
    const year = parseInt(document.getElementById('custom-year').value);
    const weekSelect = document.getElementById('custom-week');
    
    if (!weekSelect) {
        console.error('Elemento custom-week no encontrado');
        return;
    }
    
    weekSelect.innerHTML = '';
    
    // Calcular número de semanas en el año
    const weeksInYear = getWeeksInYear(year);
    
    for (let i = 1; i <= weeksInYear; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Semana ${i}`;
        weekSelect.appendChild(option);
    }
}

function getWeeksInYear(year) {
    const d = new Date(year, 11, 31);
    const week = getWeekNumber(d);
    return week === 1 ? 52 : week;
}

function getWeekNumber(date) {
    // Calcular número de semana (ISO 8601)
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}


function displayBasicStats() {
    document.getElementById('total-entries').textContent = statisticsData.totalEntries;
    document.getElementById('unique-cards').textContent = statisticsData.uniqueCardsCount;
    
    const totalOrientations = statisticsData.orientations.upright + statisticsData.orientations.reversed;
    const uprightPercent = totalOrientations > 0 ? 
        Math.round((statisticsData.orientations.upright / totalOrientations) * 100) : 0;
    const reversedPercent = totalOrientations > 0 ? 
        Math.round((statisticsData.orientations.reversed / totalOrientations) * 100) : 0;
    
    document.getElementById('upright-percent').textContent = uprightPercent + '%';
    document.getElementById('reversed-percent').textContent = reversedPercent + '%';
    
    // NO inicializar gráficos aquí - ya se hace en calculateStatistics
}

        // ===== FUNCIONES DEL SELECTOR DE PERÍODO PERSONALIZADO =====


        function updateYearSelector() {
            const yearSelect = document.getElementById('stats-year');
            const years = new Set();
            
            logHistory.forEach(entry => {
                const year = new Date(entry.date).getFullYear();
                years.add(year);
            });
            
            const sortedYears = Array.from(years).sort((a, b) => b - a);
            
            yearSelect.innerHTML = sortedYears.map(year => 
                `<option value="${year}">${year}</option>`
            ).join('');
            
            if (!yearSelect.value && sortedYears.length > 0) {
                yearSelect.value = sortedYears[0];
            }
        }

        // ===== FUNCIONES UTILITARIAS =====
        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        }