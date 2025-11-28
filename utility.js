// ===== FUNCIONES DE BASE DE DATOS =====
async function loadDecks() {
    try {
        const { data, error } = await supabase
            .from('decks')
            .select('*')
            .order('name');

        if (error) throw error;

        if (data) {
            decks = data;
            updateDeckSelectors();
        }
    } catch (error) {
        console.error('Error al cargar decks:', error);
        decks = [{
            id: 'default',
            name: 'Rider Waite Smith Centennial',
            purchase_date: '11.2023',
            extra_cards: 'N/A',
            name_changes: 'N/A',
            card_types: 'All',
            is_default: true,
            card_mappings: {}
        }];
        updateDeckSelectors();
    }
}


// ===== FUNCIONES PARA TIPOS DE TIRADA =====
function updateSpreadTypesList() {
    const spreadList = document.getElementById('spread-types-list');
    const positionsDisplay = document.getElementById('selected-spread-positions');
    
    if (!spreadList) {
        console.error('Elemento spread-types-list no encontrado');
        return;
    }
    
    if (spreadTypes.length === 0) {
        spreadList.innerHTML = '<div class="empty-history">No hay tipos de tiradas guardados</div>';
        if (positionsDisplay) {
            positionsDisplay.innerHTML = '';
        }
        return;
    }
    
    let html = '';
    
    // Filtrar tiradas por el deck actual
    const filteredSpreads = spreadTypes.filter(spread => 
        spread.deck_id === currentDeckId || spread.deck_id === 'default'
    );
    
    filteredSpreads.forEach(spread => {
        const isActive = currentSpreadType && currentSpreadType.id === spread.id;
        html += `
            <div class="spread-type-item ${isActive ? 'active' : ''}" data-id="${spread.id}">
                <div class="spread-type-details">
                   > ${spread.name} • ${spread.card_count} cartas • ${spread.description || 'Sin descripción'}
                </div>
                ${spread.tags ? `
                    <div class="spread-type-tags">
                        ${spread.tags.split(',').map(tag => 
                            `<span class="spread-tag">${tag.trim()}</span>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    spreadList.innerHTML = html;
    
    // Añadir event listeners a los items
    document.querySelectorAll('.spread-type-item').forEach(item => {
        // Remover event listeners existentes para evitar duplicados
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);
        
        // Agregar nuevo event listener
        newItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const spreadId = this.getAttribute('data-id');
            console.log('🔄 Seleccionando tirada:', spreadId);
            selectSpreadType(spreadId);
        });
    });
    
    // Actualizar display de posiciones si hay una tirada seleccionada
    if (currentSpreadType && positionsDisplay) {
        showSpreadCardsInput();
    }
}

function selectSpreadType(spreadId) {
    console.log('🔄 Seleccionando tirada:', spreadId);
    
    // Buscar la tirada
    currentSpreadType = spreadTypes.find(spread => spread.id === spreadId);
    
    if (!currentSpreadType) {
        console.error('❌ Tirada no encontrada:', spreadId);
        return;
    }
    
    // Actualizar la entrada actual de tirada
    currentSpreadEntry.spreadType = currentSpreadType;
    currentSpreadEntry.spreadCards = []; // Limpiar cartas anteriores
    
    console.log('✅ Tirada seleccionada:', currentSpreadType.name);
    
    // Actualizar la lista para mostrar la selección activa
    updateSpreadTypesList();
    
    // Mostrar interfaz para seleccionar cartas
    showSpreadCardsInput();
    
    // Hacer scroll suave a la sección de cartas
    const positionsDisplay = document.getElementById('selected-spread-positions');
    if (positionsDisplay) {
        setTimeout(() => {
            positionsDisplay.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 300);
    }
}

function showSpreadCardsInput() {
    if (!currentSpreadEntry.spreadType) {
        console.error('❌ No hay tipo de tirada seleccionado');
        return;
    }
    
    const positionsDisplay = document.getElementById('selected-spread-positions');
    if (!positionsDisplay) {
        console.error('❌ Elemento selected-spread-positions no encontrado');
        return;
    }
    
    console.log('🔄 Mostrando posiciones para:', currentSpreadEntry.spreadType.name);
    
    let cardsHTML = `
        <div class="selected-tarot-card">
            <div class="tarot-card-display">TIRADA:
                <div class="tarot-card-name">${currentSpreadEntry.spreadType.name}</div>
                <div class="spread-cards-input">
    `;
    
    // Generar inputs para cada posición
    if (currentSpreadEntry.spreadType.positions && Array.isArray(currentSpreadEntry.spreadType.positions)) {
        currentSpreadEntry.spreadType.positions.forEach((position, index) => {
            const existingCard = currentSpreadEntry.spreadCards.find(card => card.position === position);
            
            cardsHTML += `
                <div class="spread-card-input-item">
                    <div class="position-header">
                        <div class="position-number">${index + 1}</div>
                        <div class="position-name">${position}</div>
                    </div>
                    <div class="card-selection">
                        <select class="spread-card-select" data-position="${position}">
                            <option value="">Seleccionar carta...</option>
                            ${typeof tarotCards !== 'undefined' ? Object.values(tarotCards).map(card => 
                                `<option value="${card.ID}" ${existingCard && existingCard.card && existingCard.card.ID === card.ID ? 'selected' : ''}>
                                    ${card.Name} (${card.Suit})
                                </option>`
                            ).join('') : ''}
                        </select>
                        <select class="spread-orientation-select" data-position="${position}">
                            <option value="upright" ${existingCard && existingCard.orientation === 'upright' ? 'selected' : ''}>Derecha</option>
                            <option value="reversed" ${existingCard && existingCard.orientation === 'reversed' ? 'selected' : ''}>Reversa</option>
                        </select>
                    </div>
                </div>
            `;
        });
    } else {
        // Si no hay posiciones definidas, crear posiciones por defecto
        const cardCount = currentSpreadEntry.spreadType.card_count || 1;
        for (let i = 0; i < cardCount; i++) {
            const position = `Posición ${i + 1}`;
            const existingCard = currentSpreadEntry.spreadCards.find(card => card.position === position);
            
            cardsHTML += `
                <div class="spread-card-input-item">
                    <div class="position-header">
                        <div class="position-number">${i + 1}</div>
                        <div class="position-name">${position}</div>
                    </div>
                    <div class="card-selection">
                        <select class="spread-card-select" data-position="${position}">
                            <option value="">Seleccionar carta...</option>
                            ${typeof tarotCards !== 'undefined' ? Object.values(tarotCards).map(card => 
                                `<option value="${card.ID}" ${existingCard && existingCard.card && existingCard.card.ID === card.ID ? 'selected' : ''}>
                                    ${card.Name} (${card.Suit})
                                </option>`
                            ).join('') : ''}
                        </select>
                        <select class="spread-orientation-select" data-position="${position}">
                            <option value="upright" ${existingCard && existingCard.orientation === 'upright' ? 'selected' : ''}>Derecha</option>
                            <option value="reversed" ${existingCard && existingCard.orientation === 'reversed' ? 'selected' : ''}>Reversa</option>
                        </select>
                    </div>
                </div>
            `;
        }
    }
    
    cardsHTML += `
                </div>
                <button type="button" class="remove-tarot-card" id="remove-spread-selection" style="position: absolute; top: 10px; right: 10px; background: var(--background-color); color: var(--primary-color); border: 2px solid var(--primary-color); border-radius: 4px; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    ×
                </button>
            </div>
        </div>
    `;
    
    positionsDisplay.innerHTML = cardsHTML;
    
    // Añadir event listeners a los selects de cartas
    document.querySelectorAll('#selected-spread-positions .spread-card-select').forEach(select => {
        select.addEventListener('change', function() {
            updateSpreadCard(this);
        });
        
        // Si hay una carta seleccionada, actualizar el estado
        if (select.value) {
            updateSpreadCard(select);
        }
    });
    
    document.querySelectorAll('#selected-spread-positions .spread-orientation-select').forEach(select => {
        select.addEventListener('change', function() {
            updateSpreadCard(this);
        });
    });
    
    // Event listener para cambiar de tirada
    const removeButton = document.getElementById('remove-spread-selection');
    if (removeButton) {
        removeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🗑️ Cambiando selección de tirada...');
            
            currentSpreadEntry.spreadType = null;
            currentSpreadEntry.spreadCards = [];
            currentSpreadType = null;
            
            document.getElementById('selected-spread-positions').innerHTML = '';
            updateSpreadTypesList();
        });
    }
    
    console.log('✅ Interfaz de selección de cartas mostrada correctamente');
}

function updateSpreadCard(element) {
    const position = element.getAttribute('data-position');
    const cardSelect = document.querySelector(`#selected-spread-positions .spread-card-select[data-position="${position}"]`);
    const orientationSelect = document.querySelector(`#selected-spread-positions .spread-orientation-select[data-position="${position}"]`);
    
    if (!cardSelect || !orientationSelect) {
        console.error('Elementos de selección no encontrados para posición:', position);
        return;
    }
    
    const cardId = cardSelect.value;
    const orientation = orientationSelect.value;
    
    // Remover la carta existente para esta posición
    currentSpreadEntry.spreadCards = currentSpreadEntry.spreadCards.filter(card => card.position !== position);
    
    // Agregar la nueva carta si se seleccionó una
    if (cardId && typeof tarotCards !== 'undefined' && tarotCards[cardId]) {
        const card = tarotCards[cardId];
        currentSpreadEntry.spreadCards.push({
            position: position,
            card: card,
            orientation: orientation
        });
        
        console.log('Carta agregada:', { position, card: card.Name, orientation });
    }
}

// ===== FUNCIÓN PARA CARGAR TIPOS DE TIRADA =====
async function loadSpreadTypes() {
    try {
        console.log('Cargando tipos de tirada desde Supabase...');
        
        const { data, error } = await supabase
            .from('spread_types')
            .select('*')
            .order('name');

        if (error) throw error;

        if (data && data.length > 0) {
            spreadTypes = data;
            console.log('Tipos de tirada cargados:', spreadTypes.length);
            
            // Asegurarse de que las posiciones estén en el formato correcto
            spreadTypes.forEach(spread => {
                if (typeof spread.positions === 'string') {
                    try {
                        spread.positions = JSON.parse(spread.positions);
                    } catch (e) {
                        console.warn(`Error parseando posiciones para ${spread.name}:`, e);
                        // Si falla el parseo, crear posiciones por defecto
                        spread.positions = Array.from({length: spread.card_count}, (_, i) => `Posición ${i + 1}`);
                    }
                }
                
                // Si no hay posiciones, crearlas
                if (!spread.positions || spread.positions.length === 0) {
                    spread.positions = Array.from({length: spread.card_count}, (_, i) => `Posición ${i + 1}`);
                }
            });
        } else {
            console.log('No se encontraron tiradas en Supabase, usando datos por defecto');
            spreadTypes = getDefaultSpreadTypes();
        }
        
        // Actualizar la lista visual si estamos en el formulario de tiradas
        if (document.getElementById('spread-types-list')) {
            updateSpreadTypesList();
        }
        
        return spreadTypes;
        
    } catch (error) {
        console.error('Error al cargar tipos de tiradas:', error);
        spreadTypes = getDefaultSpreadTypes();
        
        if (document.getElementById('spread-types-list')) {
            updateSpreadTypesList();
        }
        
        return spreadTypes;
    }
}

// Función para obtener tiradas por defecto
function getDefaultSpreadTypes() {
    return [
        {
            id: 'default-3card',
            name: 'Pasado-Presente-Futuro',
            card_count: 3,
            positions: ['Pasado', 'Presente', 'Futuro'],
            description: 'Tirada clásica de 3 cartas',
            tags: 'Básica,Clásica',
            deck_id: 'default'
        },
        {
            id: 'default-luna',
            name: 'Luna',
            card_count: 3,
            positions: ['Lo consciente', 'Lo subconsciente', 'La síntesis'],
            description: 'Tirada de influencia lunar',
            tags: 'Astrología,Lunar',
            deck_id: 'default'
        },
        {
            id: 'default-celtic',
            name: 'Cruz Celta',
            card_count: 10,
            positions: [
                '1: La situación actual',
                '2: Los desafíos',
                '3: La base',
                '4: El pasado reciente',
                '5: Metas y aspiraciones',
                '6: El futuro próximo',
                '7: Tu actitud',
                '8: Influencias externas',
                '9: Esperanzas y temores',
                '10: Resultado final'
            ],
            description: 'Tirada tradicional de Cruz Celta',
            tags: 'Avanzada,Tradicional',
            deck_id: 'default'
        }
    ];
}

// ===== ACTUALIZAR SELECTORES DE MAZO CORREGIDO =====
function updateDeckSelectors() {
    // Actualizar selector en formulario diario
    const dailyDeckSelect = document.getElementById('daily-deck-select');
    const spreadDeckSelect = document.getElementById('spread-deck-select');
    
    if (dailyDeckSelect) {
        dailyDeckSelect.innerHTML = '';
    }
    
    if (spreadDeckSelect) {
        spreadDeckSelect.innerHTML = '';
    }
    
    decks.forEach(deck => {
        // Para formulario diario
        if (dailyDeckSelect) {
            const dailyOption = document.createElement('option');
            dailyOption.value = deck.id;
            dailyOption.textContent = deck.name;
            if (deck.is_default) {
                dailyOption.textContent += ' (Por defecto)';
            }
            dailyDeckSelect.appendChild(dailyOption);
        }
        
        // Para formulario de tirada
        if (spreadDeckSelect) {
            const spreadOption = document.createElement('option');
            spreadOption.value = deck.id;
            spreadOption.textContent = deck.name;
            if (deck.is_default) {
                spreadOption.textContent += ' (Por defecto)';
            }
            spreadDeckSelect.appendChild(spreadOption);
        }
    });
    
    // Establecer valores por defecto
    const defaultDeck = decks.find(deck => deck.is_default);
    if (defaultDeck) {
        if (dailyDeckSelect) {
            dailyDeckSelect.value = defaultDeck.id;
            currentDailyEntry.deckId = defaultDeck.id;
        }
        
        if (spreadDeckSelect) {
            spreadDeckSelect.value = defaultDeck.id;
            currentSpreadEntry.deckId = defaultDeck.id;
            currentDeckId = defaultDeck.id; // ¡IMPORTANTE! Actualizar currentDeckId
        }
    }
}

function setupFloatingControls() {
    const prevBtn = document.querySelector('.floating-controls .prev-btn');
    const nextBtn = document.querySelector('.floating-controls .next-btn');
    const menuBtn = document.getElementById('floating-menu-btn');
    const floatingMenu = document.getElementById('floating-menu');
    
    const floatingDaily = document.getElementById('floating-new-daily');
    const floatingSpread = document.getElementById('floating-new-spread');
    const floatingDecks = document.getElementById('floating-manage-decks');
    const floatingSpreads = document.getElementById('floating-manage-spreads');
    
    // Navegación del carrusel
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('⬅️ Slide anterior');
            goToPreviousSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('➡️ Slide siguiente');
            goToNextSlide();
        });
    }
    
    // Menú flotante
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📱 Abriendo menú flotante');
            floatingMenu.classList.toggle('show');
        });
    }
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (floatingMenu && !floatingMenu.contains(e.target) && menuBtn && !menuBtn.contains(e.target)) {
            floatingMenu.classList.remove('show');
        }
    });
    
    // Prevenir que el menú se cierre al hacer clic en él
    if (floatingMenu) {
        floatingMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Funcionalidad de las opciones del menú flotante
    if (floatingDaily) {
        floatingDaily.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🐕 Abriendo formulario diario desde menú flotante');
            
            // Cerrar menú
            floatingMenu.classList.remove('show');
            
            // Abrir modal de carta del día
            showDailyCardModal();
        });
    }
    
if (floatingSpread) {
    floatingSpread.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🐈 Abriendo formulario de tirada desde menú flotante');
        
        // Cerrar menú
        floatingMenu.classList.remove('show');
        
        // ✅ CORREGIDO - Usar el modal nuevo
        if (typeof showSpreadModal === 'function') {
            console.log('✅ Abriendo modal de tiradas');
            showSpreadModal();
        } else {
            console.error('❌ showSpreadModal no disponible');
            // Fallback al formulario antiguo
            const spreadForm = document.getElementById('spread-form');
            if (spreadForm) {
                spreadForm.classList.add('show');
                if (typeof initializeSpreadForm === 'function') {
                    initializeSpreadForm();
                }
            }
        }
    });
}
    
    if (floatingDecks) {
        floatingDecks.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('⚙️ Abriendo gestión de mazos desde menú flotante');
            
            floatingMenu.classList.remove('show');
            showManageDecksModal();
        });
    }
    
    if (floatingSpreads) {
        floatingSpreads.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('⚙️ Abriendo gestión de tiradas desde menú flotante');
            
            floatingMenu.classList.remove('show');
            showManageSpreadsModal();
        });
    }
    
    console.log('✅ Controles flotantes configurados');
}
// Función para actualizar el indicador de posición
function updatePositionIndicator() {
    const currentSlide = document.getElementById('current-slide');
    const totalSlides = document.getElementById('total-slides');
    
    if (currentSlide && totalSlides) {
        // Actualizar con la posición actual del carrusel
        // Esto depende de cómo manejes tu carrusel
        currentSlide.textContent = currentSlideIndex + 1;
        totalSlides.textContent = totalSlidesCount;
    }
}


// ===== FUNCIONES DE NAVEGACIÓN DEL CARRUSEL =====
let currentSlideIndex = 0;
let totalSlidesCount = 11; // Ajusta según el número real de slides

function goToPreviousSlide() {
    const chartsTrack = document.querySelector('.charts-track');
    if (!chartsTrack) return;
    
    currentSlideIndex = Math.max(0, currentSlideIndex - 1);
    updateCarouselPosition();
}

function goToNextSlide() {
    const chartsTrack = document.querySelector('.charts-track');
    if (!chartsTrack) return;
    
    currentSlideIndex = Math.min(totalSlidesCount - 1, currentSlideIndex + 1);
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const chartsTrack = document.querySelector('.charts-track');
    const chartCategories = document.querySelectorAll('.chart-category');
    
    if (chartsTrack && chartCategories.length > 0) {
        const slideWidth = chartCategories[0].offsetWidth;
        chartsTrack.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
        updatePositionIndicator();
    }
}

function updatePositionIndicator() {
    const currentSlide = document.getElementById('current-slide');
    const totalSlides = document.getElementById('total-slides');
    
    if (currentSlide && totalSlides) {
        currentSlide.textContent = currentSlideIndex + 1;
        totalSlides.textContent = totalSlidesCount;
    }
}

// ===== FUNCIÓN PARA CARGAR TIPOS DE TIRADA =====
async function loadSpreadTypes() {
    try {
        console.log('Cargando tipos de tirada desde Supabase...');
        
        const { data, error } = await supabase
            .from('spread_types')
            .select('*')
            .order('name');

        if (error) throw error;

        if (data && data.length > 0) {
            spreadTypes = data;
            console.log('✅ Tipos de tirada cargados:', spreadTypes.length);
            
            // Asegurarse de que las posiciones estén en el formato correcto
            spreadTypes.forEach(spread => {
                if (typeof spread.positions === 'string') {
                    try {
                        spread.positions = JSON.parse(spread.positions);
                    } catch (e) {
                        console.warn(`Error parseando posiciones para ${spread.name}:`, e);
                        spread.positions = Array.from({length: spread.card_count}, (_, i) => `Posición ${i + 1}`);
                    }
                }
                
                if (!spread.positions || spread.positions.length === 0) {
                    spread.positions = Array.from({length: spread.card_count}, (_, i) => `Posición ${i + 1}`);
                }
            });
        } else {
            console.log('No se encontraron tiradas en Supabase, usando datos por defecto');
            spreadTypes = getDefaultSpreadTypes();
        }
        
        return spreadTypes;
        
    } catch (error) {
        console.error('❌ Error al cargar tipos de tiradas:', error);
        spreadTypes = getDefaultSpreadTypes();
        return spreadTypes;
    }
}

// Función para obtener tiradas por defecto
function getDefaultSpreadTypes() {
    return [
        {
            id: 'default-3card',
            name: 'Pasado-Presente-Futuro',
            card_count: 3,
            positions: ['Pasado', 'Presente', 'Futuro'],
            description: 'Tirada clásica de 3 cartas',
            tags: 'Básica,Clásica',
            deck_id: 'default'
        },
        {
            id: 'default-luna',
            name: 'Luna',
            card_count: 3,
            positions: ['Lo consciente', 'Lo subconsciente', 'La síntesis'],
            description: 'Tirada de influencia lunar',
            tags: 'Astrología,Lunar',
            deck_id: 'default'
        }
    ];
}
// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupFloatingControls();
    updatePositionIndicator();
    
    // Inicializar carrusel
    const chartCategories = document.querySelectorAll('.chart-category');
    totalSlidesCount = chartCategories.length;
    
    // Asegurar que el carrusel esté en la posición inicial
    setTimeout(() => {
        updateCarouselPosition();
    }, 100);
});
