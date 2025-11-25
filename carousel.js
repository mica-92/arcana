// ===== GESTIÓN DEL CARRUSEL =====
class CarouselManager {
    constructor() {
        this.carousels = new Map();
        this.isInitialized = false;
        this.initCallbacks = [];
    }
    
    initializeCarousels() {
        if (this.isInitialized) return;
        
        console.log('🔄 Inicializando carruseles...');
        
        // Inicializar carrusel para la sección principal
        this.setupMainCarousel();
        
        // Inicializar carrusel para estadísticas
        this.setupStatsCarousel();
        
        // Inicializar carrusel para astrología
        this.setupAstrologyCarousel();
        
        this.isInitialized = true;
        console.log('✅ Carruseles inicializados');
        
        // Ejecutar callbacks de inicialización
        this.executeInitCallbacks();
    }
    
    onInit(callback) {
        if (this.isInitialized) {
            callback();
        } else {
            this.initCallbacks.push(callback);
        }
    }
    
    executeInitCallbacks() {
        this.initCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error en callback de inicialización:', error);
            }
        });
        this.initCallbacks = [];
    }
    
    setupMainCarousel() {
        const container = document.querySelector('.main-section');
        if (!container) {
            console.warn('No se encontró .main-section');
            return;
        }
        
        // Crear estructura del carrusel
        container.innerHTML = `
            <div class="carousel-container" id="main-carousel">
                <div class="carousel-track">
                    <div class="carousel-slide" data-slide="welcome">
                        <div class="daily-card-section">
                            <div id="daily-card-status">
                                <!-- La información de la carta del día se cargará aquí -->
                            </div>
                        </div>
                    </div>
                    <div class="carousel-slide" data-slide="astrology">
                        <div class="astrology-section">
                            <div id="astrology-info">
                                <!-- La información astrológica se cargará aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn prev-btn" aria-label="Sección anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="carousel-indicators">
                        <div class="carousel-indicator active" data-index="0"></div>
                        <div class="carousel-indicator" data-index="1"></div>
                    </div>
                    <button class="carousel-btn next-btn" aria-label="Siguiente sección">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        this.createCarousel('main-carousel');
    }
    
    setupStatsCarousel() {
        const container = document.querySelector('.statistics-section');
        if (!container) {
            console.warn('No se encontró .statistics-section');
            return;
        }
        
        // Guardar el contenido del modal para preservarlo
        const modalContent = container.querySelector('.period-selector-modal')?.outerHTML || '';
        
        // Reemplazar el contenido existente con la estructura del carrusel
        container.innerHTML = `
            <div class="history-title">Arcane Analysis</div>
            <div class="history-headline">estadísticas de las cartas del día</div>
            
            <div class="stats-periods">
                <button class="period-btn active" data-period="all"><i class="fa-solid fa-infinity"></i> Siempre</button>
                <button class="period-btn" data-period="month"><i class="fa-solid fa-fish"></i> Este Mes</button>
                <button class="period-btn" data-period="week"><i class="fa-solid fa-fish-fins"></i> Esta Semana</button>
                <button class="period-btn" id="custom-period-btn" data-period="custom">
                    <i class="fa-solid fa-frog"></i> Otro Período
                </button>
            </div>
            
            <div class="carousel-container" id="stats-carousel">
                <div class="carousel-track">
                    <!-- Slide 1: Gráficos principales -->
                    <div class="carousel-slide" data-slide="charts">
                        <div class="charts-section">       
                            <div class="charts-carousel">
                                <div class="charts-track">
                                    <div class="chart-category">
                                        <div class="chart-title">por Orientación</div>
                                        <div class="charts-row">
                                            <div class="chart-container">
                                                <canvas id="orientation-chart" width="200" height="200"></canvas>
                                            </div>
                                            <div class="chart-legend" id="orientation-legend"></div>
                                        </div>
                                    </div>

                                    <div class="chart-category">
                                        <div class="chart-title">por Palos</div>
                                        <div class="charts-row">
                                            <div class="chart-container">
                                                <canvas id="suits-chart" width="200" height="200"></canvas>
                                            </div>
                                            <div class="chart-legend" id="suits-legend"></div>
                                        </div>
                                    </div>

                                    <div class="chart-category">
                                        <div class="chart-title">por Elementos</div>
                                        <div class="charts-row">
                                            <div class="chart-container">
                                                <canvas id="elements-chart" width="200" height="200"></canvas>
                                            </div>
                                            <div class="chart-legend" id="elements-legend"></div>
                                        </div>
                                    </div>

                                    <div class="chart-category">
                                        <div class="chart-title">por Planetas</div>
                                        <div class="charts-row">
                                            <div class="chart-container">
                                                <canvas id="planets-chart" width="200" height="200"></canvas>
                                            </div>
                                            <div class="chart-legend" id="planets-legend"></div>
                                        </div>
                                    </div>

                                    <div class="chart-category">
                                        <div class="chart-title">por Signos</div>
                                        <div class="charts-row">
                                            <div class="chart-container">
                                                <canvas id="signs-chart" width="200" height="200"></canvas>
                                            </div>
                                            <div class="chart-legend" id="signs-legend"></div>
                                        </div>
                                    </div>

                                    <div class="chart-category">
                                        <div class="unique-card">
                                            <div class="stat-card">
                                                <div class="stat-value" id="total-entries">0</div>
                                                <div class="stat-label">
                                                    <div class="stat-icon"><i class="fa-solid fa-sun"></i></div><br> 
                                                    Registros Diarios
                                                </div>
                                            </div>
                                            <div class="stat-card">
                                                <div class="stat-value" id="unique-cards">0</div>
                                                <div class="stat-label">
                                                    <div class="stat-icon"><i class="fa-solid fa-hand-sparkles"></i></div><br> 
                                                    Cartas Únicas
                                                </div>
                                            </div>
                                            <div class="stat-card">
                                                <div class="stat-value" id="most-frequent-name">-</div>
                                                <div class="stat-label">
                                                    <div class="stat-icon"><i class="fa-solid fa-crown"></i></div><br>
                                                    <span id="most-frequent-count">Apareció 0 veces</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Slide 2: Estadísticas detalladas -->
                    <div class="carousel-slide" data-slide="detailed-stats">
                        <div class="stats-borde">
                            <!-- Tarjetas de estadísticas -->
                            <div class="stats-cards">
                                <div class="stat-card">
                                    <div class="stat-value" id="total-entries-detailed">0</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-sun"></i></div><br> Registros Diarios</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="unique-cards-detailed">0</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-hand-sparkles"></i></div><br> Cartas Únicas</div>
                                </div>
                                <div class="stat-card" style="display:none">
                                    <div class="stat-value" id="upright-percent">0%</div>
                                    <div class="stat-label">En Derecha</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="reversed-percent">0%</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-arrow-rotate-left"></i></div><br> Reversas</div>
                                </div>
                            </div>

                            <!-- Estadísticas de Palos -->
                            <div class="stats-cards" style="border-top: 2px solid var(--primary80)" >
                                <div class="stat-card">
                                    <div class="stat-value" id="major-arcana-percent">0%</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-infinity"></i></div><br> Arcanos Mayores</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="court-cards-percent">0%</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-crown"></i></div><br>Corte</div>
                                </div>

                                <div class="stat-card">
                                    <div class="stat-value" id="wands-percent">0%</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-wand-sparkles"></i></div><br>Bastos</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="cups-percent">0%</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-wine-glass"></i></div><br>Copas</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="swords-percent">0%</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-bolt-lightning"></i></div><br>Espadas</div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-value" id="pentacles-percent">0%</div>
                                    <div class="stat-label"><div class="stat-icon"><i class="fa-solid fa-coins"></i></div><br>Pentáculos</div>
                                </div>
                            </div>

                            <!-- Más estadísticas... -->
                        </div>
                    </div>
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn prev-btn" aria-label="Estadística anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="carousel-indicators">
                        <div class="carousel-indicator active" data-index="0"></div>
                        <div class="carousel-indicator" data-index="1"></div>
                    </div>
                    <button class="carousel-btn next-btn" aria-label="Siguiente estadística">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            
            ${modalContent}
        `;
        
        this.createCarousel('stats-carousel');
        
        // Re-configurar eventos de los botones de período
        this.setupStatsEvents();
    }
    
    setupStatsEvents() {
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
    }
    
    setupAstrologyCarousel() {
        const container = document.querySelector('.astrology-section');
        if (!container) {
            console.warn('No se encontró .astrology-section');
            return;
        }
        
        // Crear estructura del carrusel para astrología
        container.innerHTML = `
            <div class="carousel-container" id="astrology-carousel">
                <div class="carousel-track">
                    <div class="carousel-slide" data-slide="current">
                        <div id="astrology-info">
                            <!-- Información astrológica actual -->
                        </div>
                    </div>
                    <div class="carousel-slide" data-slide="future-phases">
                        <div class="future-phases-section">
                            <div class="astro-name" style="margin-top: 25px;">PRÓXIMAS FASES:</div>
                            <div id="future-moon-phases-inline">
                                <!-- Las fases lunares futuras se cargarán aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn prev-btn" aria-label="Información anterior">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="carousel-indicators">
                        <div class="carousel-indicator active" data-index="0"></div>
                        <div class="carousel-indicator" data-index="1"></div>
                    </div>
                    <button class="carousel-btn next-btn" aria-label="Siguiente información">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        this.createCarousel('astrology-carousel');
    }
    
    createCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) {
            console.warn(`No se encontró el carrusel: ${carouselId}`);
            return;
        }
        
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        // Función para actualizar la posición del carrusel
        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Actualizar indicadores
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
            
            // Actualizar estado de los botones
            if (prevBtn) prevBtn.disabled = currentSlide === 0;
            if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
        };
        
        // Event listeners para botones
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarousel();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentSlide < totalSlides - 1) {
                    currentSlide++;
                    updateCarousel();
                }
            });
        }
        
        // Event listeners para indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });
        
        // Navegación con teclado
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevBtn?.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn?.click();
            }
        });
        
        // Guardar referencia al carrusel
        this.carousels.set(carouselId, {
            currentSlide,
            totalSlides,
            updateCarousel
        });
        
        // Inicializar
        updateCarousel();
    }
    
    // Método para navegar a un slide específico
    goToSlide(carouselId, slideIndex) {
        const carousel = this.carousels.get(carouselId);
        if (carousel && slideIndex >= 0 && slideIndex < carousel.totalSlides) {
            carousel.currentSlide = slideIndex;
            carousel.updateCarousel();
        }
    }
    
    // Método para obtener elementos dentro de los carruseles
    getElement(selector) {
        return document.querySelector(selector);
    }
    
    getAllElements(selector) {
        return document.querySelectorAll(selector);
    }
}

// ===== INICIALIZACIÓN DEL CARRUSEL =====
let carouselManager;

// Función para inicializar después del DOM
function initializeCarousels() {
    carouselManager = new CarouselManager();
    carouselManager.initializeCarousels();
}

// Exportar para uso global
window.carouselManager = carouselManager;
window.initializeCarousels = initializeCarousels;