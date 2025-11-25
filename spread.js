// ===== FUNCIONES PARA MODAL DE GESTIÓN DE TIRADAS =====

// ===== NUEVAS FUNCIONES ESPECÍFICAS PARA CERRAR MODAL DE GESTIÓN =====
function closeManageSpreadsModal() {
    console.log('🔴 EJECUTANDO closeManageSpreadsModal()');
    const spreadsModal = document.getElementById('spreads-modal');
    if (spreadsModal) {
        spreadsModal.remove();
        console.log('✅ Modal de gestión de tiradas CERRADO');
    } else {
        console.log('ℹ️ Modal de gestión no encontrado (ya estaba cerrado)');
    }
}

function setupManageSpreadsCloseEvents() {
    console.log('🔄 Configurando eventos de cierre ESPECÍFICOS para gestión...');
    
    // Botón cerrar (X)
    const closeBtn = document.querySelector('#spreads-modal .close-modal');
    if (closeBtn) {
        console.log('✅ Botón X encontrado, agregando listener directo');
        closeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟡 CLIC en botón X - cerrando modal');
            closeManageSpreadsModal();
        };
    } else {
        console.error('❌ Botón X NO encontrado');
    }
    
    // Botón cancelar
    const cancelBtn = document.getElementById('cancel-spread');
    if (cancelBtn) {
        console.log('✅ Botón Cancelar encontrado, agregando listener directo');
        cancelBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟡 CLIC en botón Cancelar - cerrando modal');
            closeManageSpreadsModal();
        };
    } else {
        console.error('❌ Botón Cancelar NO encontrado');
    }
    
    // Clic fuera del modal
    const modal = document.getElementById('spreads-modal');
    if (modal) {
        console.log('✅ Modal encontrado, agregando listener para clic fuera');
        modal.onclick = function(e) {
            if (e.target === this) {
                console.log('🟡 CLIC fuera del modal - cerrando');
                closeManageSpreadsModal();
            }
        };
    } else {
        console.error('❌ Modal NO encontrado para clic fuera');
    }
    
    console.log('✅ Eventos de cierre ESPECÍFICOS configurados');
}

// ===== NUEVAS FUNCIONES ESPECÍFICAS PARA CERRAR MODAL DE GESTIÓN =====
function closeManageSpreadsModal() {
    console.log('🔴 EJECUTANDO closeManageSpreadsModal()');
    const spreadsModal = document.getElementById('spreads-modal');
    if (spreadsModal) {
        spreadsModal.remove();
        console.log('✅ Modal de gestión de tiradas CERRADO');
    } else {
        console.log('ℹ️ Modal de gestión no encontrado (ya estaba cerrado)');
    }
}

function setupManageSpreadsCloseEvents() {
    console.log('🔄 Configurando eventos de cierre ESPECÍFICOS para gestión...');
    
    // Botón cerrar (X)
    const closeBtn = document.querySelector('#spreads-modal .close-modal');
    if (closeBtn) {
        console.log('✅ Botón X encontrado, agregando listener directo');
        closeBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟡 CLIC en botón X - cerrando modal');
            closeManageSpreadsModal();
        };
    } else {
        console.error('❌ Botón X NO encontrado');
    }
    
    // Botón cancelar
    const cancelBtn = document.getElementById('cancel-spread');
    if (cancelBtn) {
        console.log('✅ Botón Cancelar encontrado, agregando listener directo');
        cancelBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟡 CLIC en botón Cancelar - cerrando modal');
            closeManageSpreadsModal();
        };
    } else {
        console.error('❌ Botón Cancelar NO encontrado');
    }
    
    // Clic fuera del modal
    const modal = document.getElementById('spreads-modal');
    if (modal) {
        console.log('✅ Modal encontrado, agregando listener para clic fuera');
        modal.onclick = function(e) {
            if (e.target === this) {
                console.log('🟡 CLIC fuera del modal - cerrando');
                closeManageSpreadsModal();
            }
        };
    } else {
        console.error('❌ Modal NO encontrado para clic fuera');
    }
    
    console.log('✅ Eventos de cierre ESPECÍFICOS configurados');
}

// ===== FUNCIONES PARA MODAL DE GESTIÓN DE TIRADAS =====


function showManageSpreadsModal() {
    console.log('🎯 INICIANDO showManageSpreadsModal()');
    
    // Cerrar modales existentes primero
    closeAllSpreadModals();
    
    const modalHTML = `
        <div class="modal-overlay" id="spreads-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Gestionar Tipos de Tiradas</div>
                    <button class="close-modal" id="spreads-close-btn">&times;</button>
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
                        <button type="button" class="btn-secondary" id="cancel-spread">Cancelar</button>
                        <button type="button" class="btn-primary" id="save-spread">Guardar Tirada</button>
                    </div>
                </div>
                
                <div class="decks-list" id="spreads-list">
                    <div class="modal-header-subtitle">
                        <div class="modal-subtitle">Tiradas Registradas</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ Modal HTML insertado en el DOM');
    
    // 🔄 CONFIGURACIÓN INMEDIATA SIN TIMEOUT
    console.log('🔄 Configurando eventos inmediatamente...');
    
    // 1. PRIMERO los eventos de cierre (lo más importante)
    setupManageSpreadsCloseEvents();
    
    // 2. LUEGO el resto de la funcionalidad
    const initialCount = parseInt(document.getElementById('spread-card-count').value) || 3;
    generateSpreadManagementPositions(initialCount);
    
    // 3. Configurar otros eventos
    setupSpreadModalEvents();
    loadSpreadsList();
    
    console.log('✅ Modal de gestión de tiradas COMPLETAMENTE configurado');
}


function setupSpreadModalEvents() {
    console.log('🔧 Configurando eventos secundarios del modal...');
    
    // Solo eventos que NO son de cierre
    const cardCountInput = document.getElementById('spread-card-count');
    const addPositionBtn = document.getElementById('add-position-btn');
    const saveSpreadBtn = document.getElementById('save-spread');
    
    // ✅ CAMBIO EN NÚMERO DE CARTAS
    if (cardCountInput) {
        cardCountInput.addEventListener('change', function() {
            const newCount = parseInt(this.value);
            console.log('🔄 Cambiando número de cartas a:', newCount);
            
            if (newCount >= 1 && newCount <= 20) {
                generateSpreadManagementPositions(newCount);
            } else {
                console.warn('❌ Número de cartas inválido, restableciendo a 3');
                this.value = 3;
                generateSpreadManagementPositions(3);
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
                generateSpreadManagementPositions(newCount);
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
    
    console.log('✅ Eventos secundarios del modal configurados');
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
    console.log('🎯 INICIANDO showManageSpreadsModal()');
    
    // Cerrar modales existentes primero
    closeAllSpreadModals();
    
    const modalHTML = `
        <div class="modal-overlay" id="spreads-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Gestionar Tipos de Tiradas</div>
                    <button class="close-modal" id="spreads-close-btn">&times;</button>
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
                        <button type="button" class="btn-secondary" id="cancel-spread">Cancelar</button>
                        <button type="button" class="btn-primary" id="save-spread">Guardar Tirada</button>
                    </div>
                </div>
                
                <div class="decks-list" id="spreads-list">
                    <div class="modal-header-subtitle">
                        <div class="modal-subtitle">Tiradas Registradas</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ Modal HTML insertado en el DOM');
    
    // 🔄 CONFIGURACIÓN INMEDIATA SIN TIMEOUT
    console.log('🔄 Configurando eventos inmediatamente...');
    
    // 1. PRIMERO los eventos de cierre (lo más importante)
    setupManageSpreadsCloseEvents();
    
    // 2. LUEGO el resto de la funcionalidad
    const initialCount = parseInt(document.getElementById('spread-card-count').value) || 3;
    generateSpreadManagementPositions(initialCount);
    
    // 3. Configurar otros eventos
    setupSpreadModalEvents();
    loadSpreadsList();
    
    console.log('✅ Modal de gestión de tiradas COMPLETAMENTE configurado');
}

function generateSpreadManagementPositions(count) {
    console.log('Generando posiciones para GESTIÓN:', count);
    
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
                    <div class="position-number">${i + 1}. </div>
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
        closeManageSpreadsModal(); // ← CAMBIADO
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
    
    generateSpreadManagementPositions(spread.card_count);
    
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
        closeManageSpreadsModal(); // ← CAMBIADO
        loadSpreadTypes();
        
    } catch (error) {
        console.error('Error al eliminar tirada:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

function loadSpreadsList() {
    const spreadsList = document.getElementById('spreads-list');
    
    if (spreadTypes.length === 0) {
        spreadsList.innerHTML = '<p>No hay tiradas guardadas</p>';
        return;
    }
    
    let html = '<div class="modal-header-subtitle"><div class="modal-subtitle">Tiradas Registradas</div></div>';
    
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

// ===== FUNCIONES PARA MODAL DE NUEVA TIRADA =====

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
    console.log('🔍 Contenido de spreadTypes:', spreadTypes);
    
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
    
    // Añadir event listeners CORREGIDOS
    setupSpreadPositionEventListeners();
    
    console.log('✅ Todos los event listeners de posiciones configurados');
}

// NUEVA FUNCIÓN PARA CONFIGURAR EVENT LISTENERS
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

// Debug al cargar
console.log('📁 spread.js cargado - showSpreadModal disponible:', typeof showSpreadModal);
console.log('🔍 generateSpreadManagementPositions (gestión):', typeof generateSpreadManagementPositions);
console.log('🔍 generateSpreadEntryPositions (nueva):', typeof generateSpreadEntryPositions);

// ===== ESTILOS CSS ADICIONALES PARA EL MODAL DE TIRADAS =====
/*
.spread-positions-container {
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.spread-positions-title {
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2d3748;
    font-size: 1.1rem;
}

.spread-position-group {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    border-left: 4px solid #4a90e2;
}

.position-header {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
}

.position-number {
    background: #4a90e2;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    margin-right: 0.5rem;
}

.position-name {
    font-weight: 600;
    color: #2d3748;
}

.position-controls {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    align-items: center;
}

.position-controls select {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .position-controls {
        grid-template-columns: 1fr;
    }
}
*/