function setupSpreadModalEvents() {
    console.log('🔧 Configurando eventos del modal de tiradas...');
    
    // ✅ ELEMENTOS DEL MODAL
    const modal = document.getElementById('spreads-modal');
    const closeBtn = document.querySelector('#spreads-modal .close-modal');
    const cancelBtn = document.getElementById('cancel-spread');
    const cardCountInput = document.getElementById('spread-card-count');
    const addPositionBtn = document.getElementById('add-position-btn');
    const saveSpreadBtn = document.getElementById('save-spread');
    
    // ✅ CIERRE DEL MODAL
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSpreadModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeSpreadModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeSpreadModal();
        });
    }
    
    // ✅ CAMBIO EN NÚMERO DE CARTAS
    if (cardCountInput) {
        cardCountInput.addEventListener('change', function() {
            const newCount = parseInt(this.value);
            console.log('🔄 Cambiando número de cartas a:', newCount);
            
            if (newCount >= 1 && newCount <= 20) {
                generateSpreadPositions(newCount);
            } else {
                console.warn('❌ Número de cartas inválido, restableciendo a 3');
                this.value = 3;
                generateSpreadPositions(3);
            }
        });
    }
    
    // ✅ AGREGAR POSICIÓN
    if (addPositionBtn) {
        addPositionBtn.addEventListener('click', function() {
            const currentCount = parseInt(document.getElementById('spread-card-count').value);
            const newCount = currentCount + 1;
            
            if (newCount <= 20) {
                document.getElementById('spread-card-count').value = newCount;
                console.log('➕ Agregando posición, total:', newCount);
                generateSpreadPositions(newCount);
            } else {
                console.warn('❌ Límite máximo de 20 posiciones alcanzado');
                alert('Máximo 20 posiciones permitidas');
            }
        });
    }
    
    // ✅ GUARDAR TIRADA
    if (saveSpreadBtn) {
        saveSpreadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('💾 Guardando tipo de tirada...');
            saveSpread();
        });
    }
    
    // ✅ EVENT DELEGATION PARA BOTONES DINÁMICOS
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-edit-spread')) {
            const spreadId = e.target.getAttribute('data-id');
            console.log('✏️ Editando tirada:', spreadId);
            editSpread(spreadId);
        }
        
        if (e.target.classList.contains('btn-delete-spread')) {
            const spreadId = e.target.getAttribute('data-id');
            console.log('🗑️ Solicitando eliminación de tirada:', spreadId);
            deleteSpread(spreadId);
        }
    });
    
    console.log('✅ Eventos del modal de tiradas configurados');
}

// ✅ FUNCIÓN AUXILIAR PARA CONFIGURAR EVENT LISTENERS
function setupPositionEventListeners() {
    const removeButtons = document.querySelectorAll('.remove-position');
    
    removeButtons.forEach(btn => {
        // Remover listeners existentes para evitar duplicados
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Agregar nuevos listeners
    document.querySelectorAll('.remove-position').forEach(btn => {
        btn.addEventListener('click', function() {
            const positionItem = this.closest('.position-item');
            if (positionItem) {
                positionItem.remove();
                updatePositionNumbersAndCount();
            }
        });
    });
}

// ✅ FUNCIÓN AUXILIAR ACTUALIZADA
function updatePositionNumbersAndCount() {
    const positions = document.querySelectorAll('.position-item');
    let hasEmptyPositions = false;
    
    positions.forEach((item, index) => {
        const numberElement = item.querySelector('.position-number');
        const inputElement = item.querySelector('.position-input');
        
        if (numberElement) numberElement.textContent = index + 1;
        if (inputElement) {
            inputElement.setAttribute('data-position', index);
            inputElement.setAttribute('placeholder', `Significado de la posición ${index + 1}`);
            
            // Verificar si hay posiciones vacías
            if (!inputElement.value.trim()) {
                hasEmptyPositions = true;
            }
        }
        
        item.setAttribute('data-index', index);
    });
    
    // Actualizar contador de cartas
    const cardCountInput = document.getElementById('spread-card-count');
    if (cardCountInput) {
        cardCountInput.value = positions.length;
    }
    
    // Mostrar advertencia si hay posiciones vacías
    if (hasEmptyPositions && positions.length > 0) {
        console.warn('⚠️ Hay posiciones sin nombre completado');
    }
    
    console.log(`🔄 Posiciones actualizadas: ${positions.length}`);
}

function showManageSpreadsModal() {
    const modalHTML = `
        <div class="modal-overlay" id="spreads-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Gestionar Tipos de Tiradas</div>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="spread-form">
                    <input type="hidden" id="editing-spread-id" value="">
                    <div class="form-group">
                        <label class="form-label">Nombre de la Tirada</label>
                        <input type="text" class="form-input" id="spread-name" placeholder="Ej: Luna Llena, Cruz Celta" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Número de Cartas</label>
                            <input type="number" class="form-input" id="spread-card-count" min="1" max="20" value="3">
                        </div>
                    </div>

                    <div class="form-group">
                                           <div class="form-group">
                            <label class="form-label">Mazo Asociado</label>
                            <select class="form-select" id="spread-deck">
                                ${decks.map(deck => 
                                    `<option value="${deck.id}">${deck.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Descripción</label>
                        <textarea class="form-textarea" id="spread-description" placeholder="Descripción de la tirada..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tags</label>
                        <input type="text" class="form-input" id="spread-tags" placeholder="Ej: Astrología, Básica, Avanzada">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Posiciones de las Cartas</label>
                        <div class="positions-list" id="spread-positions">
                            <!-- Las posiciones se generarán aquí -->
                        </div>
                        <button type="button" class="add-position-btn" id="add-position-btn">+ Agregar Posición</button>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn-secondary" id="cancel-spread">Cancelar</button>
                        <button class="btn-primary" id="save-spread">Guardar Tirada</button>
                    </div>
                </div>
                
                <div class="decks-list" id="spreads-list">
                    <div class="deck-item-name" style="font-size: 1.3rem; margin-left: 5px; margin-bottom: 8px;">Tiradas Guardadas</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 🔄 INICIALIZACIÓN CORREGIDA - Esperar a que el DOM esté listo
    setTimeout(() => {
        const initialCount = parseInt(document.getElementById('spread-card-count').value) || 3;
        generateSpreadPositions(initialCount);
        
        // Configurar event listeners después de generar posiciones
        setupSpreadModalEvents();
        loadSpreadsList();
    }, 50);
}

function generateSpreadPositions(count) {
    console.log('Generando posiciones:', count);
    
    const positionsContainer = document.getElementById('spread-positions');
    
    // ✅ VERIFICACIÓN ROBUSTA DEL ELEMENTO
    if (!positionsContainer) {
        console.error('❌ Elemento spread-positions no encontrado en el DOM');
        console.warn('Posibles causas:');
        console.warn('1. El modal no se ha cargado correctamente');
        console.warn('2. El ID del elemento ha cambiado');
        console.warn('3. Timing issue - el elemento aún no existe');
        return;
    }
    
    // ✅ VALIDACIÓN DEL PARÁMETRO COUNT
    if (typeof count !== 'number' || count < 1 || count > 20) {
        console.warn('⚠️ Número de posiciones inválido, usando valor por defecto (3)');
        count = 3;
    }
    
    try {
        positionsContainer.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const positionHTML = `
                <div class="position-item" data-index="${i}">
                    <div class="position-number">${i + 1}</div>
                    <input type="text" class="position-input" 
                           placeholder="Significado de la posición ${i + 1}" 
                           value="${getDefaultPositionName(i)}"
                           data-position="${i}">
                    ${i > 0 ? '<button type="button" class="remove-position" data-action="remove">&times;</button>' : ''}
                </div>
            `;
            positionsContainer.insertAdjacentHTML('beforeend', positionHTML);
        }
        
        console.log(`✅ ${count} posiciones generadas correctamente`);
        
        // ✅ CONFIGURACIÓN DE EVENT LISTENERS MEJORADA
        setupPositionEventListeners();
        
    } catch (error) {
        console.error('❌ Error crítico al generar posiciones:', error);
        positionsContainer.innerHTML = `
            <div class="error-message">
                Error al generar las posiciones. Por favor, recarga la página.
            </div>
        `;
    }
}

function getDefaultPositionName(index) {
    const defaults = ['Pasado', 'Presente', 'Futuro', 'Desafío', 'Consejo', 'Resultado'];
    return defaults[index] || `Posición ${index + 1}`;
}

async function saveSpread() {
    const spreadId = document.getElementById('editing-spread-id').value;
    const name = document.getElementById('spread-name').value;
    const cardCount = parseInt(document.getElementById('spread-card-count').value);
    const deckId = document.getElementById('spread-deck').value;
    const description = document.getElementById('spread-description').value;
    const tags = document.getElementById('spread-tags').value;
    
    if (!name) {
        alert('El nombre de la tirada es requerido');
        return;
    }
    
    if (cardCount < 1) {
        alert('El número de cartas debe ser al menos 1');
        return;
    }
    
    const positions = [];
    document.querySelectorAll('.position-input').forEach(input => {
        if (input.value.trim()) {
            positions.push(input.value.trim());
        }
    });
    
    if (positions.length !== cardCount) {
        alert('Debe completar todas las posiciones');
        return;
    }
    
    try {
        const spreadData = {
            name,
            card_count: cardCount,
            deck_id: deckId,
            positions,
            description,
            tags,
        };
        
        if (spreadId) {
            spreadData.id = spreadId;
        } else {
            spreadData.id = 'spread-' + Date.now();
        }
        
        const { data, error } = await supabase
            .from('spread_types')
            .upsert([spreadData]);
            
        if (error) throw error;
        
        alert('Tirada guardada correctamente');
        closeSpreadModal();
        loadSpreadTypes();
        
    } catch (error) {
        console.error('Error al guardar tirada:', error);
        alert('Error al guardar: ' + error.message);
    }
}

function editSpread(spreadId) {
    const spread = spreadTypes.find(s => s.id === spreadId);
    if (!spread) return;
    
    document.getElementById('editing-spread-id').value = spread.id;
    document.getElementById('spread-name').value = spread.name || '';
    document.getElementById('spread-card-count').value = spread.card_count || 3;
    document.getElementById('spread-deck').value = spread.deck_id || 'default';
    document.getElementById('spread-description').value = spread.description || '';
    document.getElementById('spread-tags').value = spread.tags || '';
    
    generateSpreadPositions(spread.card_count);
    
    setTimeout(() => {
        document.querySelectorAll('.position-input').forEach((input, index) => {
            if (spread.positions && spread.positions[index]) {
                input.value = spread.positions[index];
            }
        });
    }, 100);
    
    document.getElementById('save-spread').textContent = 'Actualizar Tirada';
}

async function deleteSpread(spreadId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tirada? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('spread_types')
            .delete()
            .eq('id', spreadId);
            
        if (error) throw error;
        
        alert('Tirada eliminada correctamente');
        closeSpreadModal();
        loadSpreadTypes();
        
    } catch (error) {
        console.error('Error al eliminar tirada:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

function closeSpreadModal() {
    const modal = document.getElementById('spreads-modal');
    if (modal) modal.remove();
}

function loadSpreadsList() {
    const spreadsList = document.getElementById('spreads-list');
    
    if (spreadTypes.length === 0) {
        spreadsList.innerHTML = '<p>No hay tiradas guardadas</p>';
        return;
    }
    
    let html = '<div class="deck-item-name" style="font-size: 1.3rem; margin-left: 5px; margin-bottom: 8px;">Tiradas Guardadas</div>';
    
    spreadTypes.forEach(spread => {
        const deckName = decks.find(d => d.id === spread.deck_id)?.name || 'Desconocido';
        
        html += `
            <div class="deck-item">
                <div class="deck-item-header">
                    <div class="deck-item-name">${spread.name}</div>
                    <div class="deck-item-actions">
                        <button class="btn-small btn-edit-spread" data-id="${spread.id}">Editar</button>
                        <button class="btn-small btn-delete-spread" data-id="${spread.id}">Eliminar</button>
                    </div>
                </div>
                <div class="deck-item-details">
                    <div><strong>Cartas:</strong> ${spread.card_count}</div>
                    <div><strong>Mazo:</strong> ${deckName}</div>
                    <div><strong>Etiquetas:</strong> ${spread.tags || 'Ninguna'}</div>
                </div>
            </div>
        `;
    });
    
    spreadsList.innerHTML = html;
}