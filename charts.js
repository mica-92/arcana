// ===== FUNCIONES PARA GRÁFICOS CIRCULARES =====
let charts = {
    orientation: null,
    suits: null,
    elements: null,
    planets: null,
    signs: null
};


// Colores para los gráficos - versión con valores hexadecimales
const statChartColors = {
    orientation: ['#1742ab', 
        '#1742ab80'], // Emerald, Raspberry Red
    
    suits: [
        '#00296b',    // Imperial Blue - Major Arcana
        '#ea7317',    // Harvest Orange - Wands
        '#006ba6',    // Bright Marine - Cups
        '#3da5d9',    // Fresh Sky - Swords
        '#fdc500',    // School Bus Yellow - Pentacles
        '#8f2d56'     // Vintage Berry - Court Cards
    ],
    
    elements: [
        '#ea7317',    // Harvest Orange - Fuego
        '#0496ff',    // Dodger Blue - Agua
        '#2364aa',    // Ocean Deep - Aire
        '#ffbc42'     // Sunflower Gold - Tierra
    ],
    
    planets: [
        '#ffd500',    // Gold - Sol
        '#b5e48c',    // Light Green - Luna
        '#34a0a4',    // Tropical Teal - Mercurio
        '#d81159',    // Raspberry Red - Venus
        '#ea7317',    // Harvest Orange - Marte
        '#184e77',    // Yale Blue - Júpiter
        '#1e6091'     // Baltic Blue - Saturno
    ],
    
    signs: [
        '#d81159',    // Raspberry Red - Aries
        '#1742ab',    // School Bus Yellow - Tauro
        '#1742ab80',    // Sunflower Gold - Géminis
        '#b5e48c',    // Light Green - Cáncer
        '#ea731750',    // Gold - Leo
        '#ea7317',    // Emerald - Virgo
        '#52b69a',    // Ocean Mist - Libra
        '#8f2d56',    // Vintage Berry - Escorpio
        '#00509d',    // Steel Azure - Sagitario
        '#1e6091',    // Baltic Blue - Capricornio
        '#1a759f',    // Cerulean - Acuario
        '#168aad'     // Bondi Blue - Piscis
    ]
};

function initializeCharts() {
    console.log('Inicializando gráficos...');
    // Destruir gráficos existentes
    destroyAllCharts();
    // Crear nuevos gráficos
    createCharts();
}

function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {
        orientation: null,
        suits: null,
        elements: null,
        planets: null,
        signs: null
    };
}

function createCharts() {
    console.log('Creando gráficos con datos:', statisticsData);
    
    // Verificar que statisticsData esté disponible
    if (!statisticsData) {
        console.error('statisticsData no está definido');
        return;
    }
    
    createOrientationChart();
    createSuitsChart();
    createElementsChart();
    createPlanetsChart();
    createSignsChart();
}

function createOrientationChart() {
    const ctx = document.getElementById('orientation-chart');
    if (!ctx) {
        console.error('Canvas orientation-chart no encontrado');
        return;
    }
    
    const canvasCtx = ctx.getContext('2d');
    const total = statisticsData.orientations.upright + statisticsData.orientations.reversed;
    
    if (charts.orientation) {
        charts.orientation.destroy();
    }
    
    if (total === 0) {
        createEmptyChart(canvasCtx, 'orientation-legend', 'No hay datos de orientación');
        return;
    }
    
    const labels = ['Derecha', 'Reversa'];
    const data = [statisticsData.orientations.upright, statisticsData.orientations.reversed];
    const colors = statChartColors.orientation;
    
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
        options: getChartOptions('Orientación')
    });
    
    createLegend('orientation-legend', labels, data, colors, total);
}

function createSuitsChart() {
    const ctx = document.getElementById('suits-chart');
    if (!ctx) {
        console.error('Canvas suits-chart no encontrado');
        return;
    }
    
    const canvasCtx = ctx.getContext('2d');
    const suitsData = statisticsData.suits;
    
    if (!suitsData) {
        createEmptyChart(canvasCtx, 'suits-legend', 'Datos no disponibles');
        return;
    }
    
    const labels = Object.keys(suitsData).filter(key => suitsData[key] > 0);
    const data = labels.map(key => suitsData[key]);
    const total = data.reduce((sum, value) => sum + value, 0);
    
    if (charts.suits) {
        charts.suits.destroy();
    }
    
    if (total === 0 || data.length === 0) {
        createEmptyChart(canvasCtx, 'suits-legend', 'No hay datos de palos');
        return;
    }
    
    // Usar solo los colores necesarios
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
        options: getChartOptions('Palos')
    });
    
    createLegend('suits-legend', labels, data, colors, total);
}

function createElementsChart() {
    const ctx = document.getElementById('elements-chart');
    if (!ctx) {
        console.error('Canvas elements-chart no encontrado');
        return;
    }
    
    const canvasCtx = ctx.getContext('2d');
    const elementsData = statisticsData.elements;
    
    if (!elementsData) {
        createEmptyChart(canvasCtx, 'elements-legend', 'Datos no disponibles');
        return;
    }
    
    const labels = Object.keys(elementsData).filter(key => elementsData[key] > 0);
    const data = labels.map(key => elementsData[key]);
    const totalForElements = statisticsData.totalEntries - (statisticsData.suits ? statisticsData.suits['Court Cards'] || 0 : 0);
    
    if (charts.elements) {
        charts.elements.destroy();
    }
    
    if (totalForElements === 0 || data.length === 0) {
        createEmptyChart(canvasCtx, 'elements-legend', 'No hay datos de elementos');
        return;
    }
    
    // Usar solo los colores necesarios
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
        options: getChartOptions('Elementos')
    });
    
    createLegend('elements-legend', labels, data, colors, totalForElements);
}

function createPlanetsChart() {
    const ctx = document.getElementById('planets-chart');
    if (!ctx) {
        console.error('Canvas planets-chart no encontrado');
        return;
    }
    
    const canvasCtx = ctx.getContext('2d');
    const planetsData = statisticsData.planets;
    
    if (!planetsData) {
        createEmptyChart(canvasCtx, 'planets-legend', 'Datos no disponibles');
        return;
    }
    
    const labels = Object.keys(planetsData).filter(key => planetsData[key] > 0);
    const data = labels.map(key => planetsData[key]);
    const totalForPlanets = statisticsData.totalEntries - (statisticsData.suits ? statisticsData.suits['Court Cards'] || 0 : 0);
    
    if (charts.planets) {
        charts.planets.destroy();
    }
    
    if (totalForPlanets === 0 || data.length === 0) {
        createEmptyChart(canvasCtx, 'planets-legend', 'No hay datos de planetas');
        return;
    }
    
    // Usar solo los colores necesarios
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
        options: getChartOptions('Planetas')
    });
    
    createLegend('planets-legend', labels, data, colors, totalForPlanets);
}

function createSignsChart() {
    const ctx = document.getElementById('signs-chart');
    if (!ctx) {
        console.error('Canvas signs-chart no encontrado');
        return;
    }
    
    const canvasCtx = ctx.getContext('2d');
    const signsData = statisticsData.signs;
    
    if (!signsData) {
        createEmptyChart(canvasCtx, 'signs-legend', 'Datos no disponibles');
        return;
    }
    
    const labels = Object.keys(signsData).filter(key => signsData[key] > 0);
    const data = labels.map(key => signsData[key]);
    const totalForSigns = statisticsData.totalEntries - (statisticsData.suits ? statisticsData.suits['Court Cards'] || 0 : 0);
    
    if (charts.signs) {
        charts.signs.destroy();
    }
    
    if (totalForSigns === 0 || data.length === 0) {
        createEmptyChart(canvasCtx, 'signs-legend', 'No hay datos de signos');
        return;
    }
    
    // Usar solo los colores necesarios
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
        options: getChartOptions('Signos Zodiacales')
    });
    
    createLegend('signs-legend', labels, data, colors, totalForSigns);
}

function getChartOptions(title) {
    return {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // Usamos nuestra propia leyenda
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderWidth: 3, // Borde más grueso
                borderColor: '#ffffff', // Color del borde
                hoverBorderWidth: 4, // Borde más grueso en hover
                hoverOffset: 12 // Aumenta la separación al hacer hover (efecto de porción agrandada)
            }
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        // Configuración específica para hover
        interaction: {
            mode: 'nearest',
            intersect: true
        },
        // Efectos de hover
        onHover: function(event, elements) {
            if (elements.length > 0) {
                event.native.target.style.cursor = 'pointer';
            } else {
                event.native.target.style.cursor = 'default';
            }
        }
    };
}

function createLegend(containerId, labels, data, colors, total) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contenedor de leyenda ${containerId} no encontrado`);
        return;
    }
    
    let html = '';
    
    // Verificar que todos los arrays tengan la misma longitud
    if (labels.length !== data.length || labels.length !== colors.length) {
        console.error('Arrays de leyenda no coinciden:', {
            labels: labels.length,
            data: data.length,
            colors: colors.length
        });
        html = `<div class="legend-item">
            <i class="fas fa-exclamation-triangle legend-icon" style="color: #ff6b6b;"></i>
            <span class="legend-name">Error en datos</span>
        </div>`;
        container.innerHTML = html;
        return;
    }
    
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
        'Pentacles': ' ´',
        'Court Cards': 'u',
        
        // Elementos
        'Fuego': '±',
        'Agua': '³', 
        'Aire': '²',
        'Tierra': ' ´',
        'Fire': '±',
        'Water': '³', 
        'Air': '²',
        'Earth': ' ´',
        
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
        'Pisces': 'L'
    };
    
    labels.forEach((label, index) => {
        const value = data[index];
        const color = colors[index];
        
        // Verificar que los valores sean válidos
        if (value > 0 && color) {
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            const iconClass = iconMap[label] || 'X';
            
            html += `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${color}"></div>
                    <span class="legend-icon">${iconClass}</span>
                    <div class="legend-label">
                        <span class="legend-name">${label}</span>
                        <span class="legend-value">${percentage}%</span>
                    </div>
                </div>
            `;
        }
    });
    
    // Si no hay elementos válidos, mostrar mensaje
    if (!html) {
        html = `<div class="legend-item">
            <i class="fas fa-chart-pie legend-icon" style="color: #666;"></i>
            <span class="legend-name">No hay datos</span>
        </div>`;
    }
    
    container.innerHTML = html;
}

function createEmptyChart(ctx, legendId, message) {
    // Limpiar canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Dibujar mensaje
    ctx.fillStyle = '#666';
    ctx.font = '14px Inconsolata';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2);
    
    // Limpiar leyenda
    const legendContainer = document.getElementById(legendId);
    if (legendContainer) {
        legendContainer.innerHTML = `<div class="legend-item"><span class="legend-name">${message}</span></div>`;
    }
}

function updateCharts() {
    console.log('Actualizando gráficos...');
    
    // Verificar que statisticsData esté disponible
    if (!statisticsData) {
        console.error('No se pueden actualizar gráficos: statisticsData no disponible');
        return;
    }
    
    initializeCharts();
}

// Verificar si los elementos del DOM están listos
function checkChartsReady() {
    const requiredElements = [
        'orientation-chart',
        'suits-chart', 
        'elements-chart',
        'planets-chart',
        'signs-chart'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    
    if (missingElements.length > 0) {
        console.warn('Elementos de gráficos no encontrados:', missingElements);
        return false;
    }
    
    return true;
}

// Inicializar gráficos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, verificando gráficos...');
    
    // Esperar un poco para asegurar que todos los elementos estén cargados
    setTimeout(() => {
        if (checkChartsReady()) {
            console.log('Todos los elementos de gráficos están listos');
            // Los gráficos se inicializarán cuando se calculen las estadísticas
        } else {
            console.error('Algunos elementos de gráficos no están disponibles');
        }
    }, 500);
});



document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
});

function initializeCarousel() {
    const track = document.querySelector('.charts-track');
    const categories = document.querySelectorAll('.chart-category');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    let currentIndex = 0;
    const totalCategories = categories.length;
    
    // Actualizar la posición del carrusel
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Actualizar indicadores
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // Actualizar estado de los botones
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalCategories - 1;
    }
    
    // Navegar al gráfico anterior
    function prevChart() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }
    
    // Navegar al siguiente gráfico
    function nextChart() {
        if (currentIndex < totalCategories - 1) {
            currentIndex++;
            updateCarousel();
        }
    }
    
    // Navegar a un gráfico específico
    function goToChart(index) {
        if (index >= 0 && index < totalCategories) {
            currentIndex = index;
            updateCarousel();
        }
    }
    
    // Event listeners para los botones
    prevBtn.addEventListener('click', prevChart);
    nextBtn.addEventListener('click', nextChart);
    
    // Event listeners para los indicadores
    indicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            goToChart(index);
        });
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevChart();
        } else if (e.key === 'ArrowRight') {
            nextChart();
        }
    });
    
    // Inicializar el carrusel
    updateCarousel();
}

// ===== ACTUALIZACIÓN DE LA FUNCIÓN DE INICIALIZACIÓN DE GRÁFICOS =====
function initializeCharts() {
    console.log('Inicializando gráficos...');
    // Destruir gráficos existentes
    destroyAllCharts();
    // Crear nuevos gráficos
    createCharts();
    // Inicializar el carrusel después de crear los gráficos
    setTimeout(initializeCarousel, 100);
}