// ===== FUNCIONES CORREGIDAS PARA TIRADAS =====
function initializeSpreadForm() {
    console.log('🚀 Inicializando formulario de tirada...');
    
    // ✅ ESTADO INICIAL ROBUSTO
    const now = new Date();
    const spreadDateInput = document.getElementById('spread-date');
    
    // Validar y establecer fecha
    if (spreadDateInput) {
        try {
            spreadDateInput.valueAsDate = now;
            console.log('✅ Fecha establecida:', now.toISOString().split('T')[0]);
        } catch (error) {
            console.warn('⚠️ No se pudo establecer la fecha automáticamente');
            spreadDateInput.value = now.toISOString().split('T')[0];
        }
    }
    
    // ✅ REINICIO COMPLETO DEL ESTADO
    currentSpreadEntry = {
        date: new Date(),
        notes: "",
        spreadType: null,
        spreadCards: [],
        deckId: currentDeckId || 'default',
        _initialized: true,
        _timestamp: Date.now()
    };
    
    currentSpreadType = null;
    
    console.log('🔄 Estado de tirada reiniciado:', currentSpreadEntry);
    
    // ✅ CONFIGURACIÓN DE EVENT LISTENERS CON VALIDACIÓN
    setupSpreadFormEventListeners();
    
    // ✅ CARGA ASINCRÓNICA DE TIPOS DE TIRADA
    loadSpreadTypes()
        .then(() => {
            console.log('✅ Tipos de tirada cargados:', spreadTypes.length);
            updateSpreadTypesList();
        })
        .catch(error => {
            console.error('❌ Error al cargar tipos de tirada:', error);
            // Usar datos por defecto como fallback
            spreadTypes = getDefaultSpreadTypes();
            updateSpreadTypesList();
        });
    
    // ✅ LIMPIAR INTERFAZ
    const positionsDisplay = document.getElementById('selected-spread-positions');
    const notesTextarea = document.getElementById('spread-notes');
    const deckSelect = document.getElementById('spread-deck-select');
    
    if (positionsDisplay) {
        positionsDisplay.innerHTML = '';
        console.log('✅ Display de posiciones limpiado');
    }
    
    if (notesTextarea) {
        notesTextarea.value = '';
        console.log('✅ Notas limpiadas');
    }
    
    if (deckSelect && decks.length > 0) {
        const defaultDeck = decks.find(d => d.is_default) || decks[0];
        if (defaultDeck) {
            deckSelect.value = defaultDeck.id;
            currentSpreadEntry.deckId = defaultDeck.id;
            currentDeckId = defaultDeck.id;
            console.log('✅ Mazo por defecto establecido:', defaultDeck.name);
        }
    }
    
    // ✅ APLICAR OVERLAY
    applyFormOverlay('spread-form');
    
    console.log('✅ Formulario de tirada inicializado correctamente');
}

// ✅ FUNCIÓN AUXILIAR PARA CONFIGURAR EVENT LISTENERS
function setupSpreadFormEventListeners() {
    console.log('🔧 Configurando event listeners del formulario...');
    
    // ✅ BOTONES DE ACCIÓN PRINCIPAL
    const saveSpreadBtn = document.getElementById('save-spread-btn');
    const clearSpreadBtn = document.getElementById('clear-spread-btn');
    const spreadDeckSelect = document.getElementById('spread-deck-select');
    const closeSpreadBtn = document.getElementById('close-spread-btn');
    
    // Remover event listeners existentes para evitar duplicados
    if (saveSpreadBtn) {
        saveSpreadBtn.replaceWith(saveSpreadBtn.cloneNode(true));
    }
    if (clearSpreadBtn) {
        clearSpreadBtn.replaceWith(clearSpreadBtn.cloneNode(true));
    }
    if (spreadDeckSelect) {
        spreadDeckSelect.replaceWith(spreadDeckSelect.cloneNode(true));
    }
    if (closeSpreadBtn) {
        closeSpreadBtn.replaceWith(closeSpreadBtn.cloneNode(true));
    }
    
    // ✅ CONFIGURAR NUEVOS EVENT LISTENERS
    const newSaveBtn = document.getElementById('save-spread-btn');
    const newClearBtn = document.getElementById('clear-spread-btn');
    const newDeckSelect = document.getElementById('spread-deck-select');
    const newCloseBtn = document.getElementById('close-spread-btn');
    
    if (newSaveBtn) {
        newSaveBtn.addEventListener('click', function(e) {
            console.log('💾 Guardando tirada...');
            e.preventDefault();
            saveSpreadEntry();
        });
        console.log('✅ Listener de guardado configurado');
    }
    
    if (newClearBtn) {
        newClearBtn.addEventListener('click', function(e) {
            console.log('🗑️ Limpiando formulario...');
            e.preventDefault();
            clearSpreadForm();
        });
        console.log('✅ Listener de limpieza configurado');
    }
    
    if (newCloseBtn) {
        newCloseBtn.addEventListener('click', function(e) {
            console.log('❌ Cerrando formulario de tirada...');
            e.preventDefault();
            document.getElementById('spread-form').classList.remove('show');
            removeFormOverlay();
        });
        console.log('✅ Listener de cierre configurado');
    }
    
    if (newDeckSelect) {
        newDeckSelect.addEventListener('change', function() {
            const newDeckId = this.value;
            console.log('🔄 Cambiando mazo:', newDeckId);
            
            currentSpreadEntry.deckId = newDeckId;
            currentDeckId = newDeckId;
            
            // Recargar tipos de tirada filtrados por el nuevo mazo
            updateSpreadTypesList();
            
            // Si hay una tirada seleccionada, verificar compatibilidad
            if (currentSpreadType && currentSpreadType.deck_id !== newDeckId) {
                console.warn('⚠️ Tirada actual no compatible con el mazo seleccionado');
                // Opcional: limpiar selección de tirada
                // currentSpreadEntry.spreadType = null;
                // currentSpreadType = null;
                // updateSpreadTypesList();
            }
        });
        console.log('✅ Listener de cambio de mazo configurado');
    }
    
    // ✅ VALIDACIÓN EN TIEMPO REAL DE NOTAS
    const notesTextarea = document.getElementById('spread-notes');
    if (notesTextarea) {
        notesTextarea.addEventListener('input', function() {
            currentSpreadEntry.notes = this.value;
            console.log(`📝 Notas actualizadas: ${this.value.length} caracteres`);
        });
    }
    
    console.log('✅ Todos los event listeners configurados correctamente');
}

// ===== FUNCIONES PARA FORMULARIO DE TIRADA =====
function clearSpreadForm() {
    currentSpreadEntry = {
        date: new Date(),
        notes: "",
        spreadType: null,
        spreadCards: [],
        deckId: 'default'
    };
    
    document.getElementById('spread-date').valueAsDate = new Date();
    document.getElementById('spread-notes').value = '';
    document.getElementById('selected-spread-positions').innerHTML = '';
    document.getElementById('spread-deck-select').value = currentSpreadEntry.deckId;
    
    // Resetear selección de tirada
    updateSpreadTypesList();
}

// ===== MODIFICAR LA FUNCIÓN DE GUARDADO DE TIRADA =====
async function saveSpreadEntry() {
    const dateInput = document.getElementById('spread-date').value;
    let entryDate;

    if (dateInput) {
        const [year, month, day] = dateInput.split('-');
        entryDate = new Date(year, month - 1, day);
    } else {
        entryDate = new Date();
    }

    currentSpreadEntry.date = entryDate;
    currentSpreadEntry.notes = document.getElementById('spread-notes').value;
    currentSpreadEntry.deckId = document.getElementById('spread-deck-select').value;

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

        console.log('Tirada guardada en Supabase:', data);

        await loadLogHistory();
        clearSpreadForm();

        alert('Tirada guardada correctamente');
        document.getElementById('spread-form').classList.remove('show');
        removeFormOverlay();

    } catch (error) {
        console.error('Error al guardar tirada:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// Función para actualizar la lista de tipos de tiradas CORREGIDA
function updateSpreadTypesList() {
    const spreadList = document.getElementById('spread-types-list');
    const positionsDisplay = document.getElementById('selected-spread-positions');
    
    if (!spreadList) {
        console.error('Elemento spread-types-list no encontrado');
        return;
    }
    
    if (spreadTypes.length === 0) {
        spreadList.innerHTML = '<div class="empty-history">No hay tipos de tiradas guardados</div>';
        positionsDisplay.innerHTML = '';
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
    
    // Añadir event listeners a los items - CORREGIDO
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
    if (currentSpreadType) {
        showSpreadCardsInput();
    }
}

// Función para seleccionar tipo de tirada CORREGIDA
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
    
    // Mostrar interfaz para seleccionar cartas - NO cerrar el modal
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

// Función para mostrar la interfaz de selección de cartas CORREGIDA
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
                ${Object.values(tarotCards).map(card => 
                    `<option value="${card.ID}" ${existingCard && existingCard.card && existingCard.card.ID === card.ID ? 'selected' : ''}>
                        ${card.Name} (${card.Suit})
                    </option>`
                ).join('')}
            </select>
            <select class="spread-orientation-select" data-position="${position}">
                <option value="upright" ${existingCard && existingCard.orientation === 'upright' ? 'selected' : ''}>Derecha</option>
                <option value="reversed" ${existingCard && existingCard.orientation === 'reversed' ? 'selected' : ''}>Reversa</option>
            </select>
        </div>
    </div>
`;
    });
    
    cardsHTML += `
                </div>
                <button type="button" class="remove-tarot-card" id="remove-spread-selection" style="position: absolute; top: 10px; right: 10px; background: var(--background-color); color: var(--primary-color); border: 2px solid var(--primary-color); border-radius: 4px; width: 30px; height: 30px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                    ×
                </button>
            </div>
        </div>
    `;
    
    positionsDisplay.innerHTML = cardsHTML;
    
    // Añadir event listeners a los selects de cartas - CORREGIDO
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
    
    // Event listener para cambiar de tirada - CORREGIDO
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
// Función para actualizar carta en la tirada CORREGIDA
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
    if (cardId && tarotCards[cardId]) {
        const card = tarotCards[cardId];
        currentSpreadEntry.spreadCards.push({
            position: position,
            card: card,
            orientation: orientation
        });
        
        console.log('Carta agregada:', { position, card: card.Name, orientation });
    }
}

// ===== FUNCIONES DE OVERLAY PARA FORMULARIOS =====
function applyFormOverlay(formId) {
    // Crear overlay si no existe
    let overlay = document.getElementById('form-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'form-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        // Cerrar formulario al hacer clic en el overlay
        overlay.addEventListener('click', function() {
            document.getElementById(formId).classList.remove('show');
            removeFormOverlay();
        });
        
        // Animar la aparición del overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
    
    // Asegurar que el formulario esté por encima del overlay
    const form = document.getElementById(formId);
    if (form) {
        form.style.zIndex = '999';
    }
}

function removeFormOverlay() {
    const overlay = document.getElementById('form-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}