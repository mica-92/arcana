// ===== FUNCIÓN UNIFICADA PARA CERRAR MODALES =====
function closeAllSpreadModals() {
    // Cerrar modal de NUEVA TIRADA
    const spreadModal = document.getElementById('spread-modal');
    if (spreadModal) {
        spreadModal.remove();
        console.log('✅ Modal de nueva tirada cerrado');
    }
    
    // Cerrar modal de GESTIÓN DE TIRADAS
    const spreadsModal = document.getElementById('spreads-modal');
    if (spreadsModal) {
        spreadsModal.remove();
        console.log('✅ Modal de gestión de tiradas cerrado');
    }
}

// ===== FUNCIONES PARA MODAL DE NUEVA TIRADA (showSpreadModal) =====

function showSpreadModal() {
    console.log('🎯 showSpreadModal() EJECUTÁNDOSE - Verificar si llega aquí');
    
    // Verificar que las dependencias estén cargadas
    if (typeof decks === 'undefined') {
        console.error('❌ decks no está definido');
        alert('Error: Los mazos no están cargados. Intenta nuevamente.');
        return;
    }

    console.log('✅ Dependencias cargadas, creando modal...');
    
    if (typeof currentSpreadEntry === 'undefined') {
        console.error('❌ currentSpreadEntry no está definido');
        // Inicializar como fallback
        currentSpreadEntry = {
            date: new Date(),
            notes: "",
            spreadType: null,
            spreadCards: [],
            deckId: 'default'
        };
    }

    // Cerrar cualquier modal existente primero
    closeAllSpreadModals();
    
    const modalHTML = `
        <div class="modal-overlay" id="spread-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Nueva Tirada</div>
                    <button class="close-modal" style="font-size: 1rem; font-weight: 600;">&times;</button>
                </div>
                
                <div class="daily-form">
                    <div class="form-group">
                        <label class="form-label">Fecha</label>
                        <input type="date" class="form-input" id="spread-modal-date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mazo</label>
                        <select class="form-select" id="spread-modal-deck-select">
                            <option value="default">Mazo Predeterminado</option>
                            ${decks.map(deck => 
                                `<option value="${deck.id}" ${deck.is_default ? 'selected' : ''}>${deck.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tipo de Tirada</label>
                        <select class="form-select" id="spread-modal-type-select">
                            <option value="">Seleccionar tipo de tirada...</option>
                            ${typeof spreadTypes !== 'undefined' && spreadTypes.length > 0 ? 
                                spreadTypes.map(spread => 
                                    `<option value="${spread.id}">${spread.name} (${spread.card_count} cartas)</option>`
                                ).join('') : '<option value="">Cargando tipos de tirada...</option>'}
                        </select>
                    </div>
                    
                    <div id="spread-modal-positions-container" class="spread-positions-container" style="display: none;">
                        <!-- Aquí se generarán dinámicamente las posiciones según el tipo de tirada -->
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Notas</label>
                        <textarea class="form-textarea" id="spread-modal-notes" placeholder="Escribe tus reflexiones sobre esta tirada..."></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn-secondary" id="clear-spread-modal">Limpiar</button>
                        <button class="btn-primary" id="save-spread-modal">Guardar Tirada</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupSpreadEntryModalEvents();
    initializeSpreadEntryModal();
    
    console.log('✅ Modal de tirada creado correctamente');
}

function setupSpreadEntryModalEvents() {
    console.log('🔧 Configurando eventos del modal de NUEVA tirada...');
    
    // Cerrar modal
    const closeBtn = document.querySelector('#spread-modal .close-modal');
    const modal = document.getElementById('spread-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeAllSpreadModals);
        console.log('✅ Listener de cierre configurado');
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeAllSpreadModals();
        });
    }
    
    // Botones de acción
    const saveBtn = document.getElementById('save-spread-modal');
    const clearBtn = document.getElementById('clear-spread-modal');
    const typeSelect = document.getElementById('spread-modal-type-select');
    const deckSelect = document.getElementById('spread-modal-deck-select');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSpreadModalEntry);
        console.log('✅ Listener de guardar configurado');
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSpreadEntryModalForm);
        console.log('✅ Listener de limpiar configurado');
    }
    
    if (typeSelect) {
        // Remover event listener existente para evitar duplicados
        typeSelect.replaceWith(typeSelect.cloneNode(true));
        const newTypeSelect = document.getElementById('spread-modal-type-select');
        
        newTypeSelect.addEventListener('change', function() {
            const spreadTypeId = this.value;
            console.log('🔄 Tipo de tirada seleccionado:', spreadTypeId);
            
            if (spreadTypeId && typeof spreadTypes !== 'undefined') {
                const selectedSpread = spreadTypes.find(spread => spread.id === spreadTypeId);
                console.log('🔍 Tirada encontrada:', selectedSpread);
                
                if (selectedSpread) {
                    currentSpreadEntry.spreadType = selectedSpread;
                    console.log('🎯 Generando posiciones para:', selectedSpread.name);
                    generateSpreadEntryPositions(selectedSpread);
                } else {
                    console.error('❌ Tirada no encontrada con ID:', spreadTypeId);
                }
            } else {
                console.log('❌ No hay tipo de tirada seleccionado');
                currentSpreadEntry.spreadType = null;
                const container = document.getElementById('spread-modal-positions-container');
                if (container) {
                    container.style.display = 'none';
                    container.innerHTML = '';
                }
            }
        });
        console.log('✅ Listener de tipo de tirada configurado');
    }
    
    if (deckSelect) {
        deckSelect.addEventListener('change', function() {
            currentSpreadEntry.deckId = this.value;
            console.log('🔄 Mazo cambiado a:', this.value);
        });
    }
    
    console.log('✅ Todos los eventos del modal de NUEVA tirada configurados');
}

function initializeSpreadEntryModal() {
    console.log('🔄 Inicializando modal de NUEVA tirada...');
    
    // Asegurarse de que los tipos de tirada estén cargados
    console.log('🔍 spreadTypes disponible:', typeof spreadTypes);
    console.log('🔍 Número de spreadTypes:', spreadTypes ? spreadTypes.length : 0);
    
    if (typeof spreadTypes === 'undefined' || spreadTypes.length === 0) {
        console.log('🔄 Cargando tipos de tirada...');
        loadSpreadTypes().then(() => {
            console.log('✅ Tipos de tirada cargados, actualizando select...');
            updateSpreadEntryModalTypes();
        }).catch(error => {
            console.error('❌ Error cargando tipos de tirada:', error);
        });
    } else {
        console.log('✅ Tipos de tirada ya cargados, actualizando select...');
        updateSpreadEntryModalTypes();
    }
    
    // Inicializar valores por defecto
    const dateInput = document.getElementById('spread-modal-date');
    const notesInput = document.getElementById('spread-modal-notes');
    const typeSelect = document.getElementById('spread-modal-type-select');
    const deckSelect = document.getElementById('spread-modal-deck-select');
    const positionsContainer = document.getElementById('spread-modal-positions-container');
    
    if (dateInput) dateInput.valueAsDate = new Date();
    if (notesInput) notesInput.value = '';
    if (typeSelect) typeSelect.value = '';
    if (deckSelect) deckSelect.value = currentSpreadEntry.deckId || 'default';
    if (positionsContainer) {
        positionsContainer.style.display = 'none';
        positionsContainer.innerHTML = '';
    }
    
    // Reiniciar la entrada actual de tirada
    currentSpreadEntry = {
        date: new Date(),
        notes: "",
        spreadType: null,
        spreadCards: [],
        deckId: deckSelect ? deckSelect.value : 'default'
    };
    
    console.log('✅ Modal de NUEVA tirada inicializado correctamente');
}

function updateSpreadEntryModalTypes() {
    const typeSelect = document.getElementById('spread-modal-type-select');
    if (!typeSelect || !spreadTypes) return;
    
    typeSelect.innerHTML = '<option value="">Seleccionar tipo de tirada...</option>';
    
    spreadTypes.forEach(spread => {
        const option = document.createElement('option');
        option.value = spread.id;
        option.textContent = `${spread.name} (${spread.card_count} cartas)`;
        typeSelect.appendChild(option);
    });
}

function clearSpreadEntryModalForm() {
    currentSpreadEntry = {
        date: new Date(),
        notes: "",
        spreadType: null,
        spreadCards: [],
        deckId: 'default'
    };
    
    const dateInput = document.getElementById('spread-modal-date');
    const notesInput = document.getElementById('spread-modal-notes');
    const typeSelect = document.getElementById('spread-modal-type-select');
    const deckSelect = document.getElementById('spread-modal-deck-select');
    const positionsContainer = document.getElementById('spread-modal-positions-container');
    
    if (dateInput) dateInput.valueAsDate = new Date();
    if (notesInput) notesInput.value = '';
    if (typeSelect) typeSelect.value = '';
    if (deckSelect) deckSelect.value = currentSpreadEntry.deckId;
    if (positionsContainer) {
        positionsContainer.style.display = 'none';
        positionsContainer.innerHTML = '';
    }
    
    console.log('🗑️ Formulario de NUEVA tirada modal limpiado');
}

function generateSpreadEntryPositions(spreadType) {
    console.log('🎯 generateSpreadEntryPositions() ejecutándose con:', spreadType);
    
    const container = document.getElementById('spread-modal-positions-container');
    console.log('🔍 Contenedor de posiciones:', container);
    
    if (!container) {
        console.error('❌ Contenedor de posiciones no encontrado');
        return;
    }
    
    if (!spreadType) {
        console.error('❌ spreadType es undefined');
        return;
    }
    
    if (!spreadType.positions || !Array.isArray(spreadType.positions)) {
        console.error('❌ Posiciones inválidas:', spreadType.positions);
        console.log('🔍 Estructura completa de spreadType:', spreadType);
        return;
    }
    
    console.log('✅ Generando', spreadType.positions.length, 'posiciones');
    
    let positionsHTML = '<div class="form-label" style="margin-top: 12px; color: var(--secondary-color);">Posiciones de la Tirada:</div>';
    
    spreadType.positions.forEach((position, index) => {
        console.log('📝 Añadiendo posición:', position, 'índice:', index);
        positionsHTML += `
            <div class="spread-position-group">
                <div class="position-controls">
                    <select class="form-select position-card-select" data-position="${position}" style="background: #b5657630; height: 41px; color: var(--secondary-color); border: 2px solid var(--secondary-color)">
                        <option value="">${index + 1}. ${position}</option>
                        ${typeof tarotCards !== 'undefined' ? 
                            Object.values(tarotCards).map(card => 
                                `<option value="${card.ID}">${card.Name} (${card.Suit})</option>`
                            ).join('') : '<option value="">Cartas no disponibles</option>'}
                    </select>
                    <select class="form-select position-orientation-select" data-position="${position}" style="margin-top: 8px; background: #b5657630; color: var(--secondary-color); border: 2px solid var(--secondary-color)">
                        <option value="upright">Derecha</option>
                        <option value="reversed">Reversa</option>
                    </select>
                </div>
            </div>
        `;
    });
    
    console.log('📄 HTML generado, actualizando contenedor...');
    container.innerHTML = positionsHTML;
    container.style.display = 'block';
    console.log('✅ Contenedor actualizado y mostrado');
    
    // Añadir event listeners
    setupSpreadPositionEventListeners();
    
    console.log('✅ Todos los event listeners de posiciones configurados');
}

function setupSpreadPositionEventListeners() {
    console.log('🔧 Configurando event listeners para posiciones...');
    
    // Remover listeners existentes para evitar duplicados
    const cardSelects = document.querySelectorAll('.position-card-select');
    const orientationSelects = document.querySelectorAll('.position-orientation-select');
    
    cardSelects.forEach(select => {
        select.replaceWith(select.cloneNode(true));
    });
    orientationSelects.forEach(select => {
        select.replaceWith(select.cloneNode(true));
    });
    
    // Agregar nuevos listeners
    document.querySelectorAll('.position-card-select').forEach(select => {
        select.addEventListener('change', function() {
            console.log('🔄 Carta cambiada en posición:', this.getAttribute('data-position'));
            updateSpreadModalCard(this);
        });
    });
    
    document.querySelectorAll('.position-orientation-select').forEach(select => {
        select.addEventListener('change', function() {
            console.log('🔄 Orientación cambiada en posición:', this.getAttribute('data-position'));
            updateSpreadModalCard(this);
        });
    });
    
    console.log(`✅ ${cardSelects.length} selects de cartas configurados`);
    console.log(`✅ ${orientationSelects.length} selects de orientación configurados`);
}

function updateSpreadModalCard(element) {
    const position = element.getAttribute('data-position');
    const cardSelect = document.querySelector(`.position-card-select[data-position="${position}"]`);
    const orientationSelect = document.querySelector(`.position-orientation-select[data-position="${position}"]`);
    
    if (!cardSelect || !orientationSelect) {
        console.error('Elementos de selección no encontrados para posición:', position);
        return;
    }
    
    const cardId = cardSelect.value;
    const orientation = orientationSelect.value;
    
    // Remover la carta existente para esta posición
    currentSpreadEntry.spreadCards = currentSpreadEntry.spreadCards.filter(card => card.position !== position);
    
    // Agregar la nueva carta si se seleccionó una
    if (cardId && tarotCards[cardId]) {
        const card = tarotCards[cardId];
        currentSpreadEntry.spreadCards.push({
            position: position,
            card: card,
            orientation: orientation
        });
        
        console.log('Carta agregada en modal:', { position, card: card.Name, orientation });
    }
}

async function saveSpreadModalEntry() {
    const dateInput = document.getElementById('spread-modal-date').value;
    let entryDate;

    if (dateInput) {
        const [year, month, day] = dateInput.split('-');
        entryDate = new Date(year, month - 1, day);
    } else {
        entryDate = new Date();
    }

    currentSpreadEntry.date = entryDate;
    currentSpreadEntry.notes = document.getElementById('spread-modal-notes').value;
    currentSpreadEntry.deckId = document.getElementById('spread-modal-deck-select').value;

    // Validaciones
    if (!currentSpreadEntry.spreadType) {
        alert('Por favor, selecciona un tipo de tirada');
        return;
    }
    
    if (currentSpreadEntry.spreadCards.length < currentSpreadEntry.spreadType.card_count) {
        const confirmSave = confirm(`Solo has seleccionado ${currentSpreadEntry.spreadCards.length} de ${currentSpreadEntry.spreadType.card_count} cartas. ¿Quieres guardar de todas formas?`);
        if (!confirmSave) {
            return;
        }
    }

    const entryData = {
        date: currentSpreadEntry.date.toISOString(),
        notes: currentSpreadEntry.notes,
        deck_id: currentSpreadEntry.deckId,
        entry_type: 'spread',
        spread_type_id: currentSpreadEntry.spreadType.id,
        spread_name: currentSpreadEntry.spreadType.name,
        spread_cards: currentSpreadEntry.spreadCards
    };

    try {
        const { data, error } = await supabase
            .from('log_entries')
            .upsert([entryData]);

        if (error) throw error;

        console.log('Tirada guardada desde modal en Supabase:', data);

        await loadLogHistory();
        clearSpreadEntryModalForm();
        closeAllSpreadModals();

        alert('Tirada guardada correctamente');

    } catch (error) {
        console.error('Error al guardar tirada desde modal:', error);
        alert('Error al guardar: ' + error.message);
    }
}