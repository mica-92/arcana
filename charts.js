// ===== FUNCIONES PARA GRÁFICOS CIRCULARES =====
let charts = {
    orientation: null,
    suits: null,
    types: null,
    elements: null,
    planets: null,
    signs: null,
    septenary: null,
    vertical: null,
    numerology: null,
    courtTypes: null
};

// Paleta de colores basada en los colores existentes
const colorPalette = {
    primary: '#1742ab',      // Azul primario
    primary80: '#1742ab80',  // Azul primario con 80% opacidad
    secondary: '#b56576',    // Rosa secundario
    secondary80: '#b5657680',// Rosa secundario con 80% opacidad
    
    // Naranjas y amarillos en armonía con la paleta
    orange: '#ea7317',       // Naranja existente
    orange80: '#ea731780',   // Naranja con 80% opacidad
    amber: '#ff9e00',        // Ámbar vibrante
    amber80: '#ff9e0080',    // Ámbar con 80% opacidad
    gold: '#ffb700',         // Dorado cálido
    gold80: '#ffb70080',     // Dorado con 80% opacidad
    yellow: '#ffd500',       // Amarillo existente
    yellow80: '#ffd50080',   // Amarillo con 80% opacidad
    
    // Colores complementarios
    teal: '#34a0a4',         // Verde azulado
    teal80: '#34a0a480',     // Verde azulado con 80% opacidad
    forest: '#1e6091',       // Azul forestal
    forest80: '#1e609180',   // Azul forestal con 80% opacidad
    magenta: '#d81159',      // Magenta vibrante
    magenta80: '#d8115980',  // Magenta con 80% opacidad
    mint: '#52b69a',         // Verde menta
    mint80: '#52b69a80',     // Verde menta con 80% opacidad
    plum: '#8f2d56',         // Ciruela oscuro
    plum80: '#8f2d5680',     // Ciruela con 80% opacidad
    lime: '#b5e48c',         // Lima suave
    lime80: '#b5e48c80',     // Lima con 80% opacidad
    
    // Colores de acento
    coral: '#ff6b6b',        // Coral existente
    coral80: '#ff6b6b80',    // Coral con 80% opacidad
    aqua: '#4ecdc4',         // Aqua existente
    aqua80: '#4ecdc480',     // Aqua con 80% opacidad
    sky: '#45b7d1',          // Azul cielo existente
    sky80: '#45b7d180',      // Azul cielo con 80% opacidad
    honey: '#feca57',        // Miel existente
    honey80: '#feca5780'     // Miel con 80% opacidad
};

// Colores para los gráficos - actualizados con la nueva paleta
const statChartColors = {
    orientation: [
        colorPalette.primary, 
        colorPalette.primary80
    ],
    suits: [
        colorPalette.orange,    // Bastos/Wands
        colorPalette.orange80,
        colorPalette.primary,   // Copas/Cups  
        colorPalette.primary80,
        colorPalette.amber,     // Espadas/Swords
        colorPalette.amber80,
        colorPalette.gold       // Oros/Pentacles
    ],
    types: [
        colorPalette.primary,   // Arcanos Mayores
        colorPalette.secondary, // Arcanos Menores
        colorPalette.coral      // Cartas de Corte
    ],
    elements: [
        colorPalette.orange,    // Fuego
        colorPalette.orange80,
        colorPalette.primary,   // Agua
        colorPalette.primary80,
        colorPalette.amber,     // Aire
        colorPalette.amber80,
        colorPalette.gold       // Tierra
    ],
    planets: [
        colorPalette.orange,    // Sol
        colorPalette.orange80,
        colorPalette.primary,   // Luna
        colorPalette.primary80,
        colorPalette.amber,     // Mercurio
        colorPalette.amber80,
        colorPalette.gold,      // Venus
        colorPalette.gold80,
        colorPalette.yellow,    // Marte
        colorPalette.yellow80,
        colorPalette.teal       // Júpiter
    ],
    signs: [
        colorPalette.orange,    // Aries
        colorPalette.orange80,
        colorPalette.primary,   // Tauro
        colorPalette.primary80,
        colorPalette.amber,     // Géminis
        colorPalette.amber80,
        colorPalette.gold,      // Cáncer
        colorPalette.gold80,
        colorPalette.yellow,    // Leo
        colorPalette.yellow80,
        colorPalette.teal,      // Virgo
        colorPalette.teal80,
        colorPalette.forest,    // Libra
        colorPalette.forest80,
        colorPalette.magenta,   // Escorpio
        colorPalette.magenta80,
        colorPalette.mint,      // Sagitario
        colorPalette.mint80,
        colorPalette.plum,      // Capricornio
        colorPalette.plum80,
        colorPalette.lime,      // Acuario
        colorPalette.lime80,
        colorPalette.coral      // Piscis
    ],
    septenary: [
        colorPalette.orange,    // 1ra Séptuple
        colorPalette.orange80,
        colorPalette.primary,   // 2da Séptuple
        colorPalette.primary80,
        colorPalette.amber,     // 3ra Séptuple
        colorPalette.amber80,
        colorPalette.gold,      // 4ta Séptuple
        colorPalette.gold80,
        colorPalette.yellow,    // 5ta Séptuple
        colorPalette.yellow80,
        colorPalette.teal,      // 6ta Séptuple
        colorPalette.teal80,
        colorPalette.forest     // 7ma Séptuple
    ],
    vertical: [
        colorPalette.orange,    // 1ra Vertical
        colorPalette.orange80,
        colorPalette.primary,   // 2da Vertical
        colorPalette.primary80,
        colorPalette.amber,     // 3ra Vertical
        colorPalette.amber80,
        colorPalette.gold,      // 4ta Vertical
        colorPalette.gold80,
        colorPalette.yellow,    // 5ta Vertical
        colorPalette.yellow80,
        colorPalette.teal,      // 6ta Vertical
        colorPalette.teal80,
        colorPalette.forest     // 7ma Vertical
    ],
    numerology: [
        colorPalette.orange,    // 1
        colorPalette.orange80,
        colorPalette.primary,   // 2
        colorPalette.primary80,
        colorPalette.amber,     // 3
        colorPalette.amber80,
        colorPalette.gold,      // 4
        colorPalette.gold80,
        colorPalette.yellow,    // 5
        colorPalette.yellow80,
        colorPalette.teal,      // 6
        colorPalette.teal80,
        colorPalette.forest,    // 7
        colorPalette.forest80,
        colorPalette.magenta,   // 8
        colorPalette.magenta80,
        colorPalette.mint,      // 9
        colorPalette.mint80,
        colorPalette.plum       // 10
    ],
    courtTypes: [
        colorPalette.orange,     // Pajes/Pages
        colorPalette.teal,      // Caballeros/Knights
        colorPalette.primary,       // Reinas/Queens
        colorPalette.gold      // Reyes/Kings
    ]
};

// Plugin para texto central fijo
const centerTextPlugin = {
    id: 'centerText',
    afterDraw: function(chart) {
        if (chart.config.options.plugins.centerText && chart.config.options.plugins.centerText.enabled !== false) {
            const ctx = chart.ctx;
            const centerTextConfig = chart.config.options.plugins.centerText;
            const text = centerTextConfig.text || '';
            const color = centerTextConfig.color || '#000';
            
            if (!text) return;
            
            ctx.save();
            
            // Posición central del área del gráfico
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
            
            // Configurar estilo de texto
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = color;
            
            // Dividir texto en líneas
            const lines = text.split('\n');
            const lineHeight = 30;
            const totalHeight = (lines.length - 1) * lineHeight;
            const startY = centerY - totalHeight / 2;
            
            // Dibujar cada línea
            lines.forEach((line, index) => {
                if (index === 0) {
                    // Primera línea - símbolo
                    ctx.font = `bold 32px 'Astronomicon', sans-serif`;
                    ctx.fillText(line, centerX, startY + index * lineHeight);
                } else {
                    // Segunda línea - porcentaje
                    ctx.font = `bold 20px 'Inconsolata', monospace`;
                    ctx.fillText(line, centerX, startY + index * lineHeight);
                }
            });
            
            ctx.restore();
        }
    }
};

// Registrar el plugin
Chart.register(centerTextPlugin);

function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {
        orientation: null,
        suits: null,
        types: null,
        elements: null,
        planets: null,
        signs: null,
        septenary: null,
        vertical: null,
        numerology: null,
        courtTypes: null
    };
}

function createCharts() {
    console.log('Creando gráficos con datos:', statisticsData);
    
    if (!statisticsData) {
        console.error('statisticsData no está definido');
        return;
    }
    
    createOrientationChart();
    createTypesChart();
    createSuitsChart();
    createElementsChart();
    createPlanetsChart();
    createSignsChart();
    createSeptenaryChart();
    createVerticalChart();
    createNumerologyChart();
    createCourtTypesChart();
}

function createOrientationChart() {
    const ctx = document.getElementById('orientation-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    
    if (charts.orientation) {
        charts.orientation.destroy();
    }
    
    const labels = ['Derecha', 'Reversa'];
    const data = [statisticsData.orientations.upright, statisticsData.orientations.reversed];
    const colors = statChartColors.orientation;
    const total = data.reduce((sum, value) => sum + value, 0);
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.orientation = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Orientación', statisticsData)
    });
    
    createInlineLegend('orientation-legend', labels, data, colors, total);
}

function createTypesChart() {
    const ctx = document.getElementById('types-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    
    if (charts.types) {
        charts.types.destroy();
    }
    
    const majorsCount = statisticsData.suits['Major Arcana'] || 0;
    const courtsCount = statisticsData.suits['Court Cards'] || 0;
    const minorsCount = statisticsData.totalEntries - majorsCount - courtsCount;
    
    const labels = ['Majors', 'Minors', 'Courts'];
    const data = [majorsCount, minorsCount, courtsCount];
    const total = statisticsData.totalEntries;
    
    if (total === 0 || data.every(val => val === 0)) {
        createInfoChart(canvasCtx, 'types-legend', 'Todas las cartas');
        return;
    }
    
    const colors = statChartColors.types;
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.types = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Tipos de Cartas', statisticsData)
    });
    
    createInlineLegend('types-legend', labels, data, colors, total);
}

function createSuitsChart() {
    const ctx = document.getElementById('suits-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    
    if (charts.suits) {
        charts.suits.destroy();
    }
    
    const suitsData = {
        'Wands': statisticsData.suits['Wands'] || 0,
        'Cups': statisticsData.suits['Cups'] || 0,
        'Swords': statisticsData.suits['Swords'] || 0,
        'Pentacles': statisticsData.suits['Pentacles'] || 0
    };
    
    const labels = Object.keys(suitsData).filter(key => suitsData[key] > 0);
    const data = labels.map(key => suitsData[key]);
    const total = data.reduce((sum, value) => sum + value, 0);
    const minorsTotal = statisticsData.totalEntries - (statisticsData.suits['Major Arcana'] || 0) - (statisticsData.suits['Court Cards'] || 0);
    
    if (total === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'suits-legend', `Analizando ${minorsTotal} cartas\n(Solo Arcanos Menores)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.suits[index % statChartColors.suits.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.suits = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Palos (Minors)', statisticsData)
    });
    
    createInlineLegend('suits-legend', labels, data, colors, total);
}

function createElementsChart() {
    const ctx = document.getElementById('elements-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    const elementsData = statisticsData.elements;
    
    if (!elementsData) {
        createInfoChart(canvasCtx, 'elements-legend', 'Datos no disponibles');
        return;
    }
    
    const labels = Object.keys(elementsData).filter(key => elementsData[key] > 0);
    const data = labels.map(key => elementsData[key]);
    const totalForElements = statisticsData.totalEntries - (statisticsData.suits ? statisticsData.suits['Court Cards'] || 0 : 0);
    
    if (charts.elements) {
        charts.elements.destroy();
    }
    
    if (totalForElements === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'elements-legend', `Analizando ${totalForElements} cartas\n(Excluyendo Court Cards)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.elements[index % statChartColors.elements.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.elements = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Elementos', statisticsData)
    });
    
    createInlineLegend('elements-legend', labels, data, colors, totalForElements);
}

function createPlanetsChart() {
    const ctx = document.getElementById('planets-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    const planetsData = statisticsData.planets;
    
    const labels = Object.keys(planetsData).filter(key => planetsData[key] > 0);
    const data = labels.map(key => planetsData[key]);
    const totalForPlanets = statisticsData.totalEntries - (statisticsData.suits ? statisticsData.suits['Court Cards'] || 0 : 0);
    
    if (charts.planets) {
        charts.planets.destroy();
    }
    
    if (totalForPlanets === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'planets-legend', `Analizando ${totalForPlanets} cartas\n(Solo Arcanos Mayores y Menores)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.planets[index % statChartColors.planets.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.planets = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Planetas', statisticsData)
    });
    
    createInlineLegend('planets-legend', labels, data, colors, totalForPlanets);
}

function createSignsChart() {
    const ctx = document.getElementById('signs-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    const signsData = statisticsData.signs;
    
    if (!signsData) {
        createInfoChart(canvasCtx, 'signs-legend', 'Datos no disponibles');
        return;
    }
    
    const labels = Object.keys(signsData).filter(key => signsData[key] > 0);
    const data = labels.map(key => signsData[key]);
    const totalForSigns = statisticsData.totalEntries - (statisticsData.suits ? statisticsData.suits['Court Cards'] || 0 : 0);
    
    if (charts.signs) {
        charts.signs.destroy();
    }
    
    if (totalForSigns === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'signs-legend', `Analizando ${totalForSigns} cartas\n(Solo Arcanos Mayores y Menores)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.signs[index % statChartColors.signs.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.signs = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Signos Zodiacales', statisticsData)
    });
    
    createInlineLegend('signs-legend', labels, data, colors, totalForSigns);
}

function createSeptenaryChart() {
    const ctx = document.getElementById('septenary-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    const septenaryData = statisticsData.septenary;
    
    if (!septenaryData) {
        createInfoChart(canvasCtx, 'septenary-legend', 'Datos no disponibles');
        return;
    }
    
    if (charts.septenary) {
        charts.septenary.destroy();
    }
    
    const labels = Object.keys(septenaryData).filter(key => septenaryData[key] > 0);
    const data = labels.map(key => septenaryData[key]);
    const total = data.reduce((sum, value) => sum + value, 0);
    const majorsTotal = statisticsData.suits['Major Arcana'] || 0;
    
    if (total === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'septenary-legend', `Analizando ${majorsTotal} cartas\n(Solo Arcanos Mayores)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.septenary[index % statChartColors.septenary.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.septenary = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Septenary', statisticsData)
    });
    
    createInlineLegend('septenary-legend', labels, data, colors, total);
}

function createVerticalChart() {
    const ctx = document.getElementById('vertical-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    const verticalData = statisticsData.vertical;
    
    if (!verticalData) {
        createInfoChart(canvasCtx, 'vertical-legend', 'Datos no disponibles');
        return;
    }
    
    if (charts.vertical) {
        charts.vertical.destroy();
    }
    
    const labels = Object.keys(verticalData).filter(key => verticalData[key] > 0);
    const data = labels.map(key => verticalData[key]);
    const total = data.reduce((sum, value) => sum + value, 0);
    const majorsTotal = statisticsData.suits['Major Arcana'] || 0;
    
    if (total === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'vertical-legend', `Analizando ${majorsTotal} cartas\n(Solo Arcanos Mayores)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.vertical[index % statChartColors.vertical.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.vertical = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Vertical', statisticsData)
    });
    
    createInlineLegend('vertical-legend', labels, data, colors, total);
}

function createNumerologyChart() {
    const ctx = document.getElementById('numerology-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    const numerologyData = statisticsData.numerology;
    
    if (!numerologyData) {
        createInfoChart(canvasCtx, 'numerology-legend', 'Datos no disponibles');
        return;
    }
    
    if (charts.numerology) {
        charts.numerology.destroy();
    }
    
    const labels = Object.keys(numerologyData).filter(key => numerologyData[key] > 0);
    const data = labels.map(key => numerologyData[key]);
    const total = data.reduce((sum, value) => sum + value, 0);
    
    if (total === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'numerology-legend', `Analizando ${statisticsData.totalEntries} cartas\n(Todas las cartas)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.numerology[index % statChartColors.numerology.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.numerology = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Numerología', statisticsData)
    });
    
    createInlineLegend('numerology-legend', labels, data, colors, total);
}

function createCourtTypesChart() {
    const ctx = document.getElementById('court-types-chart');
    if (!ctx) return;
    
    const canvasCtx = ctx.getContext('2d');
    const courtTypesData = statisticsData.courtTypes;
    
    if (!courtTypesData) {
        createInfoChart(canvasCtx, 'court-types-legend', 'Datos no disponibles');
        return;
    }
    
    if (charts.courtTypes) {
        charts.courtTypes.destroy();
    }
    
    const labels = Object.keys(courtTypesData).filter(key => courtTypesData[key] > 0);
    const data = labels.map(key => courtTypesData[key]);
    const total = data.reduce((sum, value) => sum + value, 0);
    const courtsTotal = statisticsData.suits['Court Cards'] || 0;
    
    if (total === 0 || data.length === 0) {
        createInfoChart(canvasCtx, 'court-types-legend', `Analizando ${courtsTotal} cartas\n(Solo Court Cards)`);
        return;
    }
    
    const colors = labels.map((_, index) => {
        return statChartColors.courtTypes[index % statChartColors.courtTypes.length] || '#CCCCCC';
    });
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    };
    
    charts.courtTypes = new Chart(canvasCtx, {
        type: 'pie',
        data: chartData,
        options: getChartOptions('Tipos de Court Cards', statisticsData)
    });
    
    createInlineLegend('court-types-legend', labels, data, colors, total);
}

function getChartOptions(title, data) {
    return {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Desactivamos la leyenda nativa de Chart.js
            },
            tooltip: {
                enabled: false,
                external: customTooltip
            },
        },
        elements: {
            arc: {
                borderWidth: 3,
                borderColor: '#ffffff',
                hoverBorderWidth: 4,
                hoverOffset: 8
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 800
        },
        interaction: {
            mode: 'nearest',
            intersect: true
        },
        layout: {
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }
        }
    };
}

// NUEVA FUNCIÓN: Crear leyenda inline debajo del pie chart
function createInlineLegend(containerId, labels, data, colors, total) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contenedor de leyenda ${containerId} no encontrado`);
        return;
    }
    
    let html = '<div class="inline-legend">';
    
    // Mapeo de iconos para cada categoría
    const iconMap = {
        // Orientación
        'Derecha': '`',
        'Reversa': 'b',
        
        // Palos
        'Major Arcana': 'y',
        'Wands': '±',
        'Cups': '³',
        'Swords': '²',
        'Pentacles': '´',
        'Court Cards': 'u',
        
        // Elementos
        'Fuego': '±',
        'Agua': '³', 
        'Aire': '²',
        'Tierra': '´',
        'Fire': '±',
        'Water': '³', 
        'Air': '²',
        'Earth': '´',
        
        // Planetas
        'Sol': 'Q',
        'Luna': 'R',
        'Mercurio': 'S',
        'Venus': 'T',
        'Marte': 'U',
        'Júpiter': 'V',
        'Saturno': 'W',
        'Sun': 'Q',
        'Moon': 'R',
        'Mercury': 'S',
        'Mars': 'U',
        'Jupiter': 'V',
        'Saturn': 'W',
        
        // Signos zodiacales
        'Aries': 'A',
        'Tauro': 'B',
        'Géminis': 'C',
        'Cáncer': 'D',
        'Leo': 'E',
        'Virgo': 'F',
        'Libra': 'G',
        'Escorpio': 'H',
        'Sagitario': 'I',
        'Capricornio': 'J',
        'Acuario': 'K',
        'Piscis': 'L',
        'Taurus': 'B',
        'Gemini': 'C',
        'Cancer': 'D',
        'Scorpio': 'H',
        'Sagittarius': 'I',
        'Capricorn': 'J',
        'Aquarius': 'K',
        'Pisces': 'L',
        
        // Tipos
        'Majors': 'y',
        'Minors': 't', 
        'Courts': 'u',
        
        // Septenary
        'First': '1',
        'Second': '2',
        'Third': '3',
        'Fourth': '4', 
        'Fifth': '5',
        'Sixth': '6',
        'Seventh': '7',
        
        // Numerology  
        'One': '1',
        'Two': '2',
        'Three': '3',
        'Four': '4',
        'Five': '5', 
        'Six': '6',
        'Seven': '7',
        'Eight': '8',
        'Nine': '9',
        'Ten': '10',
        
        // Court Types
        'Pages': '§',
        'Knights': '£',
        'Queens': '¢', 
        'Kings': '¦'
    };
    
    labels.forEach((label, index) => {
        const value = data[index];
        const color = colors[index];
        
        if (value > 0 && color) {
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            const iconClass = iconMap[label] || '●';
            
            html += `
                <div class="legend-item-inline">
                    <div class="legend-color-inline" style="background-color: ${color}"></div>
                    <span class="legend-icon-inline astronomicon">${iconClass}</span>
                    <span class="legend-name-inline">${label}</span>
                    <span class="legend-value-inline">${value} (${percentage}%)</span>
                </div>
            `;
        }
    });
    
    html += '</div>';
    
    // Si no hay elementos válidos, mostrar mensaje
    if (html === '<div class="inline-legend"></div>') {
        html = `<div class="inline-legend">
            <div class="legend-item-inline">
                <span class="legend-name-inline">No hay datos</span>
            </div>
        </div>`;
    }
    
    container.innerHTML = html;
}

function createInfoChart(ctx, legendId, message) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.fillStyle = '#f5f5f5';
    ctx.beginPath();
    ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width / 3, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#666';
    ctx.font = 'bold 24px Astronomicon';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('●', ctx.canvas.width / 2, ctx.canvas.height / 2 - 15);
    
    ctx.font = 'bold 14px Inconsolata';
    const lines = message.split('\n');
    const lineHeight = 18;
    const startY = ctx.canvas.height / 2 + 10;
    
    lines.forEach((line, index) => {
        ctx.fillText(line, ctx.canvas.width / 2, startY + index * lineHeight);
    });
    
    const legendContainer = document.getElementById(legendId);
    if (legendContainer) {
        legendContainer.innerHTML = `<div class="inline-legend">
            <div class="legend-item-inline">
                <span class="legend-name-inline">${message.replace(/\n/g, ' - ')}</span>
            </div>
        </div>`;
    }
}

function customTooltip(context) {
    let tooltipEl = document.getElementById('chartjs-tooltip');
    
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<div class="tooltip-content"></div>';
        document.body.appendChild(tooltipEl);
    }
    
    const tooltipModel = context.tooltip;
    if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
    }
    
    const symbolMap = {
        'Derecha': '`', 'Reversa': 'b',
        'Major Arcana': 'y', 'Wands': '±', 'Cups': '³', 'Swords': '²', 'Pentacles': '´', 'Court Cards': 'u',
        'Fuego': '±', 'Agua': '³', 'Aire': '²', 'Tierra': '´',
        'Fire': '±', 'Water': '³', 'Air': '²', 'Earth': '´',
        'Sol': 'Q', 'Luna': 'R', 'Mercurio': 'S', 'Venus': 'T', 'Marte': 'U', 'Júpiter': 'V', 'Saturno': 'W',
        'Sun': 'Q', 'Moon': 'R', 'Mercury': 'S', 'Mars': 'U', 'Jupiter': 'V', 'Saturn': 'W',
        'Aries': 'A', 'Tauro': 'B', 'Géminis': 'C', 'Cáncer': 'D', 'Leo': 'E', 'Virgo': 'F', 'Libra': 'G',
        'Escorpio': 'H', 'Sagitario': 'I', 'Capricornio': 'J', 'Acuario': 'K', 'Piscis': 'L',
        'Taurus': 'B', 'Gemini': 'C', 'Cancer': 'D', 'Scorpio': 'H', 'Sagittarius': 'I', 'Capricorn': 'J',
        'Aquarius': 'K', 'Pisces': 'L',
        'Majors': 'y', 'Minors': 't', 'Courts': 'u',
        'First': '1', 'Second': '2', 'Third': '3', 'Fourth': '4', 'Fifth': '5', 'Sixth': '6', 'Seventh': '7',
        'One': '1', 'Two': '2', 'Three': '3', 'Four': '4', 'Five': '5', 'Six': '6', 'Seven': '7', 'Eight': '8', 'Nine': '9', 'Ten': '10',
        'Pages': '§', 'Knights': '£', 'Queens': '¢', 'Kings': '¦'
    };
    
    const label = tooltipModel.dataPoints[0].label;
    const value = tooltipModel.dataPoints[0].raw;
    const total = tooltipModel.dataPoints[0].dataset.data.reduce((a, b) => a + b, 0);
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    const symbol = symbolMap[label] || '●';
    const color = tooltipModel.labelColors[0].borderColor;
    
    const content = `
        <div class="tooltip-header" style="border-left-color: ${color}">
            <span class="tooltip-symbol astronomicon">${symbol}</span>
            <span class="tooltip-label">${label}</span>
        </div>
        <div class="tooltip-body">
            <span class="tooltip-value">${value} carta${value !== 1 ? 's' : ''}</span><br>
            <span class="tooltip-percentage">${percentage}%</span>
        </div>
    `;
    
    tooltipEl.querySelector('.tooltip-content').innerHTML = content;
    
    const position = context.chart.canvas.getBoundingClientRect();
    tooltipEl.style.opacity = '1';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
    tooltipEl.style.pointerEvents = 'none';
}

function updateCharts() {
    if (!statisticsData) return;
    initializeCharts();
}

function initializeCharts() {
    destroyAllCharts();
    createCharts();
    setTimeout(initializeCarousel, 100);
}

// Función para inicializar el carrusel (si existe)
function initializeCarousel() {
    const track = document.querySelector('.charts-track');
    const categories = document.querySelectorAll('.chart-category');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    if (!track || categories.length === 0) return;
    
    let currentIndex = 0;
    const totalCategories = categories.length;
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === totalCategories - 1;
    }
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCategories - 1) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (index >= 0 && index < totalCategories) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });
    
    updateCarousel();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.getElementById('orientation-chart')) {
            console.log('Elementos de gráficos listos');
        }
    }, 500);
});