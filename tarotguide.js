// ===== GUÍA DE TAROT - FUNCIONES PRINCIPALES =====

let tarotCardNotes = {};

// Cargar notas de cartas desde Supabase
async function loadTarotCardNotes() {
    try {
        const { data, error } = await supabase
            .from('tarot_card_notes')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) throw error;

        if (data) {
            tarotCardNotes = {};
            data.forEach(note => {
                tarotCardNotes[note.card_id] = note;
            });
            console.log('Notas de cartas cargadas:', tarotCardNotes);
        }
    } catch (error) {
        console.error('Error al cargar notas de cartas:', error);
    }
}

// Guardar/actualizar notas de carta
async function saveTarotCardNotes(cardId, notes) {
    try {
        const existingNote = tarotCardNotes[cardId];
        
        if (existingNote) {
            // Actualizar nota existente
            const { data, error } = await supabase
                .from('tarot_card_notes')
                .update({ 
                    notes: notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingNote.id);

            if (error) throw error;
        } else {
            // Crear nueva nota
            const { data, error } = await supabase
                .from('tarot_card_notes')
                .insert([{ 
                    card_id: cardId,
                    notes: notes
                }]);

            if (error) throw error;
        }

        // Recargar notas
        await loadTarotCardNotes();
        return true;
    } catch (error) {
        console.error('Error al guardar notas de carta:', error);
        return false;
    }
}

// Mostrar guía de tarot
function displayTarotGuide() {
    const container = document.getElementById('tarot-guide-container');
    if (!container) return;

    // Agrupar cartas por tipo
    const majors = Object.values(tarotCards).filter(card => card.Type === 'Majors');
    const wands = Object.values(tarotCards).filter(card => card.Suit === 'Wands');
    const cups = Object.values(tarotCards).filter(card => card.Suit === 'Cups');
    const swords = Object.values(tarotCards).filter(card => card.Suit === 'Swords');
    const pentacles = Object.values(tarotCards).filter(card => card.Suit === 'Pentacles');

    let html = `
        <div class="tarot-categories">
            <div class="tarot-category">
                <h3 class="history-title">Arcanos Mayores</h3>
                <div class="cards-grid">
                    ${majors.map(card => createCardButton(card)).join('')}
                </div>
            </div>
            
            <div class="tarot-category">
                <h3 class="history-title">Bastos</h3>
                <div class="cards-grid">
                    ${wands.map(card => createCardButton(card)).join('')}
                </div>
            </div>
            
            <div class="tarot-category">
                <h3 class="history-title">Copas</h3>
                <div class="cards-grid">
                    ${cups.map(card => createCardButton(card)).join('')}
                </div>
            </div>
            
            <div class="tarot-category">
                <h3 class="history-title">Espadas</h3>
                <div class="cards-grid">
                    ${swords.map(card => createCardButton(card)).join('')}
                </div>
            </div>
            
            <div class="tarot-category">
                <h3 class="history-title">Oros</h3>
                <div class="cards-grid">
                    ${pentacles.map(card => createCardButton(card)).join('')}
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    setupTarotCardEvents();
}

// Crear botón de carta
function createCardButton(card) {
    const usageCount = getCardUsageCount(card.ID);
    const hasNotes = tarotCardNotes[card.ID] && tarotCardNotes[card.ID].notes;
    
    return `
        <button class="tarot-card-btn" data-card-id="${card.ID}">
            <div class="card-name">${card.Name}</div>
            ${hasNotes ? '<div class="card-has-notes">📝</div>' : ''}
        </button>
    `;
}

// Contar uso de carta en el historial
function getCardUsageCount(cardId) {
    return logHistory.filter(entry => 
        entry.entry_type === 'daily' && 
        entry.tarot_card && 
        entry.tarot_card.ID === cardId
    ).length;
}

// Configurar eventos de las cartas
function setupTarotCardEvents() {
    document.querySelectorAll('.tarot-card-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const cardId = this.getAttribute('data-card-id');
            const card = tarotCards[cardId];
            if (card) {
                showTarotCardModal(card);
            }
        });
    });
}

// Mostrar modal de carta detallada
function showTarotCardModal(card) {
    const cardUsage = getCardUsageHistory(card.ID);
    const cardNote = tarotCardNotes[card.ID];
    
    const modalHTML = `
        <div class="modal-overlay" id="tarot-card-modal">
            <div class="modal-content tarot-card-modal-content">
                <div class="modal-header">
                    <div class="modal-title">${card.Name}</div>
                    <button class="close-modal" id="tarot-card-close">&times;</button>
                </div>
                
                <div class="tarot-card-details">
                    <div class="card-info-section">
                        <h3 class="section-title">Información de la Carta</h3>
                        <div class="card-properties">
                            <div class="property">
                                <span class="property-label">Palo:</span>
                                <span class="property-value">${card.Suit}</span>
                            </div>
                            ${card.Type ? `
                            <div class="property">
                                <span class="property-label">Tipo:</span>
                                <span class="property-value">${card.Type}</span>
                            </div>
                            ` : ''}
                            ${card.Numerology ? `
                            <div class="property">
                                <span class="property-label">Numerología:</span>
                                <span class="property-value">${card.Numerology}</span>
                            </div>
                            ` : ''}
                            ${card.Planet ? `
                            <div class="property">
                                <span class="property-label">Planeta:</span>
                                <span class="property-value">${card.Planet}</span>
                            </div>
                            ` : ''}
                            ${card.Sign ? `
                            <div class="property">
                                <span class="property-label">Signo:</span>
                                <span class="property-value">${card.Sign}</span>
                            </div>
                            ` : ''}
                            ${card.Element ? `
                            <div class="property">
                                <span class="property-label">Elemento:</span>
                                <span class="property-value">${card.Element}</span>
                            </div>
                            ` : ''}
                            ${card.Septenary ? `
                            <div class="property">
                                <span class="property-label">Septenary:</span>
                                <span class="property-value">${card.Septenary}</span>
                            </div>
                            ` : ''}
                            ${card.Vertical ? `
                            <div class="property">
                                <span class="property-label">Vertical:</span>
                                <span class="property-value">${card.Vertical}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="card-usage-section">
                        <h3 class="section-title">Como Carta del Día</h3>
                        ${cardUsage.length > 0 ? `
                            <div class="usage-list">
                                ${cardUsage.map(usage => `
                                    <div class="usage-item">
                                        <span class="usage-date">${formatDateForDisplay(usage.date)}</span>
                                        ${usage.notes ? `<span class="usage-notes">${usage.notes}</span>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div class="no-usage">Esta carta no ha sido usada como carta del día</div>
                        `}
                    </div>
                    
                    <div class="card-notes-section">
                        <h3 class="section-title">Notas Personales</h3>
                        <textarea class="form-textarea card-notes-textarea" 
                                  placeholder="Agrega tus notas personales sobre esta carta..."
                                  id="tarot-card-notes">${cardNote ? cardNote.notes : ''}</textarea>
                        <button class="btn-primary" id="save-card-notes">Guardar Notas</button>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary" id="close-tarot-card-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupTarotCardModalEvents(card.ID);
}

// Obtener historial de uso de carta
function getCardUsageHistory(cardId) {
    return logHistory
        .filter(entry => 
            entry.entry_type === 'daily' && 
            entry.tarot_card && 
            entry.tarot_card.ID === cardId
        )
        .map(entry => ({
            date: entry.date,
            notes: entry.notes || ''
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Configurar eventos del modal de carta
function setupTarotCardModalEvents(cardId) {
    const modal = document.getElementById('tarot-card-modal');
    const closeBtn = document.getElementById('tarot-card-close');
    const closeModalBtn = document.getElementById('close-tarot-card-modal');
    const saveNotesBtn = document.getElementById('save-card-notes');
    
    const closeModal = () => {
        if (modal) modal.remove();
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    if (saveNotesBtn) {
        saveNotesBtn.addEventListener('click', async () => {
            const notesTextarea = document.getElementById('tarot-card-notes');
            if (notesTextarea) {
                const success = await saveTarotCardNotes(cardId, notesTextarea.value);
                if (success) {
                    alert('Notas guardadas correctamente');
                    // Actualizar display si es necesario
                    displayTarotGuide();
                } else {
                    alert('Error al guardar las notas');
                }
            }
        });
    }
    
    // Cerrar con tecla Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', escHandler);
    
    // Limpiar event listener cuando se cierre el modal
    if (modal) {
        modal.addEventListener('click', function handler(e) {
            if (e.target === this) {
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
}

// Inicializar guía de tarot
async function initializeTarotGuide() {
    await loadTarotCardNotes();
    displayTarotGuide();
}