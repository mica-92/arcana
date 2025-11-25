// ===== FUNCIONES DE MODALES =====
function showManageDecksModal() {
    const modalHTML = `
        <div class="modal-overlay" id="decks-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Gestionar Mazos</div>
                    <button class="close-modal" style="font-size: 1rem; font-weight: 600;">&times;</button>
                </div>
                
                <div class="deck-form">
                    <input type="hidden" id="editing-deck-id" value="">
                    <div class="form-group">
                        <label class="form-label">Nombre del Mazo</label>
                        <input type="text" class="form-input" id="deck-name" placeholder="Ej: Rider Waite Smith" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Fecha de Compra (MM.YYYY)</label>
                        <input type="text" class="form-input" id="deck-purchase-date" placeholder="Ej: 11.2023">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cartas Extra</label>
                        <textarea class="form-textarea" id="deck-extra-cards" placeholder="Ej: The Fools Journey (Major), Cortesen (Court)"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Cambios de Nombre</label>
                        <textarea class="form-textarea" id="deck-name-changes" placeholder='Ej: {"Judgment": "Eon", "The Fool": "The Seeker"}'></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Tipos de Cartas</label>
                        <select class="form-select" id="deck-card-types">
                            <option value="All">Todos (Major, Minor, Court)</option>
                            <option value="Majors">Solo Arcanos Mayores</option>
                            <option value="Minors">Solo Arcanos Menores</option>
                            <option value="Courts">Solo Cartas de Corte</option>
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn-secondary" id="cancel-deck">Cancelar</button>
                        <button class="btn-primary" id="save-deck">Guardar Mazo</button>
                    </div>
                </div>                
                
                <div class="modal-header-subtitle">
                    <div class="modal-subtitle">Mazos Registrados</div>
                </div>

                    <div class="form-label" style="margin-top: 12px; color: var(--secondary-color);">Gestionar Mazos</div>
                
                
                <div class="decks-list" id="decks-list">
            </div></div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    loadDecksList();
    setupDeckModalEvents();
}

function setupDeckModalEvents() {
    document.querySelector('#decks-modal .close-modal').addEventListener('click', closeDeckModal);
    document.getElementById('cancel-deck').addEventListener('click', closeDeckModal);
    document.getElementById('decks-modal').addEventListener('click', function(e) {
        if (e.target === this) closeDeckModal();
    });
    
    document.getElementById('save-deck').addEventListener('click', saveDeck);
    
    // Event delegation para botones dinámicos - CORREGIDO
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-set-default')) {
            const deckId = e.target.getAttribute('data-id');
            console.log('🔄 Botón establecer por defecto clickeado:', deckId);
            setDefaultDeck(deckId);
        }
        if (e.target.classList.contains('btn-edit')) {
            const deckId = e.target.getAttribute('data-id');
            console.log('✏️ Botón editar clickeado:', deckId);
            editDeck(deckId);
        }
        if (e.target.classList.contains('btn-delete')) {
            const deckId = e.target.getAttribute('data-id');
            console.log('🗑️ Botón eliminar clickeado:', deckId);
            deleteDeck(deckId);
        }
    });
}

function loadDecksList() {
    const decksList = document.getElementById('decks-list');
    
    if (decks.length === 0) {
        decksList.innerHTML = '<p>No hay mazos guardados</p>';
        return;
    }
    
    let html = '';
    
    decks.forEach(deck => {
        html += `
            <div class="deck-item">
                <div class="deck-item-name" style="color: var(--secondary-color);">${deck.name} ${deck.is_default ? '(<i>Default</i>)' : ''}</div>

                <div class="deck-item-details" style="color: #b5657680;">
                    <div><strong>Fecha de Compra:</strong> ${deck.purchase_date || 'No especificada'}</div>
                    <div><strong>Tipos de Cartas:</strong> ${deck.card_types || 'Todos'}</div>
                </div>
                <div class="deck-item-header">
                    <div class="deck-item-actions">
                        ${!deck.is_default ? `<button class="btn-small btn-set-default" data-id="${deck.id}">Default</button>` : ''}
                        <button class="btn-small btn-edit" data-id="${deck.id}">Editar</button>
                        ${!deck.is_default ? `<button class="btn-small btn-delete" data-id="${deck.id}">Eliminar</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    decksList.innerHTML = html;
}

async function saveDeck() {
    const deckId = document.getElementById('editing-deck-id').value;
    const name = document.getElementById('deck-name').value;
    const purchaseDate = document.getElementById('deck-purchase-date').value;
    const extraCards = document.getElementById('deck-extra-cards').value;
    const nameChanges = document.getElementById('deck-name-changes').value;
    const cardTypes = document.getElementById('deck-card-types').value;
    
    if (!name) {
        alert('El nombre del mazo es requerido');
        return;
    }
    
    try {
        let cardMappings = {};
        if (nameChanges) {
            try {
                cardMappings = JSON.parse(nameChanges);
            } catch (e) {
                alert('Error en el formato JSON de cambios de nombre');
                return;
            }
        }
        
        const deckData = {
            name,
            purchase_date: purchaseDate,
            extra_cards: extraCards,
            name_changes: nameChanges,
            card_types: cardTypes,
            card_mappings: cardMappings,
            is_default: false // Por defecto no es predeterminado
        };
        
        if (deckId) {
            deckData.id = deckId;
            // Si estamos editando, mantener el estado is_default actual
            const existingDeck = decks.find(d => d.id === deckId);
            if (existingDeck) {
                deckData.is_default = existingDeck.is_default || false;
            }
        } else {
            deckData.id = 'deck-' + Date.now();
            // Si no hay mazos, hacer este el predeterminado
            if (decks.length === 0) {
                deckData.is_default = true;
            }
        }
        
        const { data, error } = await supabase
            .from('decks')
            .upsert([deckData]);
            
        if (error) throw error;
        
        alert('Mazo guardado correctamente');
        closeDeckModal();
        loadDecks(); // Recargar los mazos desde la base de datos
        
    } catch (error) {
        console.error('Error al guardar deck:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// FUNCIÓN CORREGIDA: Establecer mazo por defecto - CON WHERE CLAUSE
async function setDefaultDeck(deckId) {
    if (!confirm('¿Estás seguro de que quieres establecer este mazo como predeterminado?')) {
        return;
    }
    
    try {
        console.log('🔄 Estableciendo mazo predeterminado:', deckId);
        
        // Primero, quitar el estado predeterminado de TODOS los mazos que lo tengan
        const { error: resetError } = await supabase
            .from('decks')
            .update({ is_default: false })
            .eq('is_default', true); // WHERE clause para actualizar solo los que son predeterminados
            
        if (resetError) {
            console.error('Error al resetear mazos predeterminados:', resetError);
            throw resetError;
        }
        
        console.log('✅ Todos los mazos predeterminados reseteados');
        
        // Luego, establecer el mazo seleccionado como predeterminado
        const { error } = await supabase
            .from('decks')
            .update({ is_default: true })
            .eq('id', deckId);
            
        if (error) {
            console.error('Error al establecer mazo predeterminado:', error);
            throw error;
        }
        
        console.log('✅ Mazo establecido como predeterminado:', deckId);
        
        alert('Mazo establecido como predeterminado');
        
        // Recargar los mazos para reflejar los cambios
        await loadDecks();
        
        // Cerrar el modal después de recargar
        closeDeckModal();
        
    } catch (error) {
        console.error('❌ Error al establecer deck por defecto:', error);
        alert('Error: ' + error.message);
    }
}

function editDeck(deckId) {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return;
    
    document.getElementById('editing-deck-id').value = deck.id;
    document.getElementById('deck-name').value = deck.name || '';
    document.getElementById('deck-purchase-date').value = deck.purchase_date || '';
    document.getElementById('deck-extra-cards').value = deck.extra_cards || '';
    document.getElementById('deck-name-changes').value = deck.name_changes || '';
    document.getElementById('deck-card-types').value = deck.card_types || 'All';
    
    document.getElementById('save-deck').textContent = 'Actualizar Mazo';
}

async function deleteDeck(deckId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este mazo? Esta acción no se puede deshacer.')) {
        return;
    }
    
    try {
        const deckToDelete = decks.find(d => d.id === deckId);
        const isDefault = deckToDelete && deckToDelete.is_default;
        
        const { error } = await supabase
            .from('decks')
            .delete()
            .eq('id', deckId);
            
        if (error) throw error;
        
        // Si eliminamos el mazo predeterminado, establecer otro como predeterminado
        if (isDefault && decks.length > 1) {
            const remainingDecks = decks.filter(d => d.id !== deckId);
            if (remainingDecks.length > 0) {
                const newDefaultDeck = remainingDecks[0];
                await supabase
                    .from('decks')
                    .update({ is_default: true })
                    .eq('id', newDefaultDeck.id);
                console.log(`✅ Nuevo mazo predeterminado establecido: ${newDefaultDeck.name}`);
            }
        }
        
        alert('Mazo eliminado correctamente');
        closeDeckModal();
        loadDecks();
        
    } catch (error) {
        console.error('Error al eliminar deck:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

// FUNCIÓN PARA ELIMINAR UN MAZO ESPECÍFICO (SOLUCIÓN TEMPORAL)
async function deleteSpecificDeck(deckNameToDelete) {
    if (!confirm(`¿Estás seguro de que quieres eliminar el mazo "${deckNameToDelete}"? Esta acción no se puede deshacer.`)) {
        return;
    }
    
    try {
        // Buscar el mazo por nombre
        const deckToDelete = decks.find(d => d.name === deckNameToDelete);
        
        if (!deckToDelete) {
            alert('Mazo no encontrado');
            return;
        }
        
        const isDefault = deckToDelete.is_default === true;
        
        const { error } = await supabase
            .from('decks')
            .delete()
            .eq('id', deckToDelete.id);
            
        if (error) throw error;
        
        // Si eliminamos el mazo predeterminado, establecer otro como predeterminado
        if (isDefault && decks.length > 1) {
            const remainingDecks = decks.filter(d => d.id !== deckToDelete.id);
            if (remainingDecks.length > 0) {
                const newDefaultDeck = remainingDecks[0];
                await supabase
                    .from('decks')
                    .update({ is_default: true })
                    .eq('id', newDefaultDeck.id);
                console.log(`✅ Nuevo mazo predeterminado: ${newDefaultDeck.name}`);
            }
        }
        
        alert(`Mazo "${deckNameToDelete}" eliminado correctamente`);
        closeDeckModal();
        loadDecks();
        
    } catch (error) {
        console.error('Error al eliminar deck:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

function closeDeckModal() {
    const modal = document.getElementById('decks-modal');
    if (modal) modal.remove();
}