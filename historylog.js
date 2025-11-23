        async function loadLogHistory() {
            try {
                const { data, error } = await supabase
                    .from('log_entries')
                    .select('*')
                    .order('date', { ascending: false });

                if (error) throw error;

                if (data) {
                    logHistory = data.map(entry => {
                        const dateFromDB = new Date(entry.date);
                        const normalizedDate = new Date(
                            dateFromDB.getFullYear(),
                            dateFromDB.getMonth(),
                            dateFromDB.getDate()
                        );
                        
                        const normalizedEntry = {
                            ...entry,
                            date: normalizedDate
                        };
                        
                        if (!normalizedEntry.entry_type) {
                            normalizedEntry.entry_type = 'daily';
                        }
                        
                        if (normalizedEntry.tarot_card && typeof normalizedEntry.tarot_card === 'string') {
                            try {
                                const cleanString = normalizedEntry.tarot_card.replace(/\\"/g, '"');
                                normalizedEntry.tarot_card = JSON.parse(cleanString);
                            } catch (e) {
                                console.warn('No se pudo parsear tarot_card string:', normalizedEntry.tarot_card, e);
                                normalizedEntry.tarot_card = null;
                            }
                        }
                        
                        if (normalizedEntry.spread_cards && typeof normalizedEntry.spread_cards === 'string') {
                            try {
                                const cleanString = normalizedEntry.spread_cards.replace(/\\"/g, '"');
                                normalizedEntry.spread_cards = JSON.parse(cleanString);
                            } catch (e) {
                                console.warn('No se pudo parsear spread_cards:', normalizedEntry.spread_cards);
                                normalizedEntry.spread_cards = null;
                            }
                        }
                        
                        return normalizedEntry;
                    });
                    displayLogHistory();
                }
                return data;
            } catch (error) {
                console.error('Error al cargar desde Supabase:', error);
                return [];
            }
        }

        function displayLogHistory() {
            const logHistoryContainer = document.getElementById('log-history');
            const activeTab = document.querySelector('.history-tab.active').getAttribute('data-tab');
            
            let filteredHistory = [...logHistory];
            if (activeTab === 'daily') {
                filteredHistory = logHistory.filter(entry => entry.entry_type === 'daily');
            } else if (activeTab === 'spread') {
                filteredHistory = logHistory.filter(entry => entry.entry_type === 'spread');
            }
            
            if (filteredHistory.length === 0) {
                logHistoryContainer.innerHTML = '<div class="empty-history">No hay entradas en el historial</div>';
                return;
            }
            
            let historyHTML = '';
            
            filteredHistory.forEach(entry => {
                const formattedDate = formatDateForDisplay(entry.date);
                
                if (entry.entry_type === 'daily') {
                    historyHTML += createDailyEntryHTML(entry, formattedDate);
                } else {
                    historyHTML += createSpreadEntryHTML(entry, formattedDate);
                }
            });
            
            logHistoryContainer.innerHTML = historyHTML;
            setupHistoryEventListeners();
        }

        function formatDateForDisplay(date) {
            const dateObj = new Date(date);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
        }


// ===== FUNCIONES MODIFICADAS =====
function createDailyEntryHTML(entry, formattedDate) {
    let cardHTML = '';
    let reversalBadge = '';
    
    if (entry.tarot_card) {
        let cardName = 'Carta desconocida';
        
        if (typeof entry.tarot_card === 'object' && entry.tarot_card.Name) {
            cardName = entry.tarot_card.Name;
        } else if (typeof entry.tarot_card === 'string') {
            try {
                const parsedCard = JSON.parse(entry.tarot_card.replace(/\\"/g, '"'));
                if (parsedCard && parsedCard.Name) {
                    cardName = parsedCard.Name;
                }
            } catch (e) {
                console.warn('No se pudo parsear tarot_card string:', entry.tarot_card);
            }
        }
        
        if (entry.tarot_orientation === 'reversed') {
            reversalBadge = '<span class="reversal-badge">R</span>';
        }
        
        cardHTML = `${cardName} ${reversalBadge}`;
    } else {
        cardHTML = '<em>Sin carta registrada</em>';
    }
    
    return `
        <div class="log-entry daily-entry" data-id="${entry.id}" data-type="daily">
            <div class="daily-header">
                <span class="daily-date">${formattedDate}</span>
                <span class="daily-card">${cardHTML}</span>
            </div>
        </div>
    `;
}

function createSpreadEntryHTML(entry, formattedDate) {
    const spreadName = entry.spread_name || 'Tirada Personalizada';
    
    return `
        <div class="log-entry spread-entry" data-id="${entry.id}" data-type="spread">
            <div class="spread-header">
                <span class="spread-date">${formattedDate}</span>
                <span class="spread-name">${spreadName}</span>
            </div>
        </div>
    `;
}



function setupHistoryEventListeners() {
    // Manejo de tabs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('history-tab')) {
            document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            displayLogHistory();
        }
    });
    
    // Manejo de clic en entradas del historial
    document.addEventListener('click', function(e) {
        const entryElement = e.target.closest('.log-entry');
        if (entryElement) {
            const entryId = entryElement.getAttribute('data-id');
            showEntryDetailsModal(entryId);
        }
    });
    
    // Botón de información de spread (si existe)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('spread-info-btn')) {
            const entryId = e.target.getAttribute('data-entry-id');
            const entry = logHistory.find(e => parseInt(e.id) === parseInt(entryId));
            if (entry) {
                showSpreadInfoModal(entry);
            }
        }
    });
}

// ===== NUEVAS FUNCIONES ===== desrrollo de conocimineto & 

function showEntryDetailsModal(entryId) {
    const searchId = parseInt(entryId);
    const entry = logHistory.find(e => parseInt(e.id) === searchId);
    
    if (!entry) {
        alert('No se encontró información de la entrada');
        return;
    }
    
    // Primero, limpiar cualquier modal existente
    closeAllModals();
    
    const modalHTML = `
        <div class="spread-modal-overlay" id="entry-details-modal">
            <div class="spread-modal-content">
                <div class="modal-header">
                    <div class="spread-modal-title">
                        ${entry.entry_type === 'daily' ? 'Carta del Día' : 'Tirada: ' + (entry.spread_name || 'Personalizada')}
                    </div>
                    <button class="spread-modal-close" id="entry-modal-close">&times;</button>
                </div>
                <div class="deck-form">
                <div class="spread-date">
                    ${formatDateForDisplay(entry.date)}
                </div></div>
                
                ${createEntryDetailsHTML(entry)}
                
                <div class="modal-actions" style="margin-top: 25px; display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn-secondary" id="close-entry-modal">Cerrar</button>
                    <button class="btn-primary delete-entry-btn" data-id="${entry.id}" style="display: block !important;">
                        Eliminar Entrada
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar eventos del modal
    setupModalEvents();
}

function setupModalEvents() {
    setTimeout(() => {
        const modal = document.getElementById('entry-details-modal');
        const closeBtn = document.getElementById('entry-modal-close');
        const closeModalBtn = document.getElementById('close-entry-modal');
        
        if (!modal || !closeBtn || !closeModalBtn) {
            console.error('No se pudieron encontrar los elementos del modal');
            return;
        }
        
        // Función para cerrar el modal
        const closeModal = function() {
            if (modal) {
                modal.remove();
                // Remover event listener de teclado
                document.removeEventListener('keydown', escHandler);
            }
        };
        
        // Event listener para tecla Escape
        const escHandler = function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        };
        
        // Configurar eventos
        closeBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Agregar event listener para tecla Escape
        document.addEventListener('keydown', escHandler);
        
        // Configurar botón de eliminar
        const deleteBtn = document.querySelector('#entry-details-modal .delete-entry-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                const entryId = this.getAttribute('data-id');
                if (confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
                    deleteEntryById(entryId);
                    closeModal();
                }
            });
        }
        
    }, 10);
}

function closeAllModals() {
    const modals = document.querySelectorAll('.spread-modal-overlay, .modal-overlay');
    modals.forEach(modal => modal.remove());
}
function createEntryDetailsHTML(entry) {
    let html = '';
    
    if (entry.entry_type === 'daily') {
        html += createDailyDetailsHTML(entry);
    } else {
        html += createSpreadDetailsHTML(entry);
    }
    
    if (entry.notes) {
        html += `
        <div class="notes-section">
            <div class="log-entry-notes">
                <strong>Notas:</strong><br>${entry.notes}
            </div></div>
        `;
    }
    
    return html;
}

function createDailyDetailsHTML(entry) {
    let cardHTML = '';
    let reversalBadge = '';
    
    if (entry.tarot_card) {
        let cardName = 'Carta desconocida';
        let cardSuit = '';
        let cardElement = '';
        let cardPlanet = '';
        let cardSign = '';
        
        if (typeof entry.tarot_card === 'object' && entry.tarot_card.Name) {
            cardName = entry.tarot_card.Name;
            cardSuit = entry.tarot_card.Suit || '';
            cardElement = entry.tarot_card.Element || '';
            cardPlanet = entry.tarot_card.Planet || '';
            cardSign = entry.tarot_card.Sign || '';
        } else if (typeof entry.tarot_card === 'string') {
            try {
                const parsedCard = JSON.parse(entry.tarot_card.replace(/\\"/g, '"'));
                if (parsedCard && parsedCard.Name) {
                    cardName = parsedCard.Name;
                    cardSuit = parsedCard.Suit || '';
                    cardElement = parsedCard.Element || '';
                    cardPlanet = parsedCard.Planet || '';
                    cardSign = parsedCard.Sign || '';
                }
            } catch (e) {
                console.warn('No se pudo parsear tarot_card string:', entry.tarot_card);
            }
        }
        
        if (entry.tarot_orientation === 'reversed') {
            reversalBadge = '<span class="reversal-badge">R</span>';
        }
        
        cardHTML = `
        <div class="tarot-section" style="border-top: 1px solid var(--primary-color);">
        <div class="deck-item-name">
        <div class="selected-tarot-card" style="margin-bottom:10px;">
                <div class="tarot-card-display">
                    <div class="tarot-card-name" style="font-size: 1rem;">${cardName}</div>

                    <div>${entry.tarot_orientation === 'reversed' ? 'Reversa' : 'Derecha'} ${reversalBadge}</div>
                    
                    <div class="tarot-card-details">
                        <div class="tarot-card-detail">${cardSuit}</div>
                            <div class="tarot-card-detail">${cardSuit}</div>
                            ${cardElement ? `<div class="tarot-card-detail">${cardElement}</div>` : ''}
                            ${cardPlanet ? `<div class="tarot-card-detail">${cardPlanet}</div>` : ''}
                            ${cardSign ? `<div class="tarot-card-detail">${cardSign}</div>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        cardHTML = '<div class="empty-position">No hay carta registrada</div>';
    }
    
    return cardHTML;
}

function createSpreadDetailsHTML(entry) {
    // Reutilizar la función existente de showSpreadInfoModal pero sin crear modal
    const spreadCards = entry.spread_cards || [];
    const totalCards = spreadCards.length;
    const filledCards = spreadCards.filter(card => card && card.card).length;
    const uprightCards = spreadCards.filter(card => card && card.card && card.orientation === 'upright').length;
    const reversedCards = spreadCards.filter(card => card && card.card && card.orientation === 'reversed').length;
    const spreadStats = calculateSpreadStatistics(spreadCards);
    
    return `
        <div class="history-title" style="margin: 20px 0 15px 0; font-size: 1.3rem;">
            Estadísticas de la Tirada
        </div>
        
        <div class="spread-stats">
            <div class="spread-stat">
                <div class="spread-stat-value">${totalCards}</div>
                <div class="spread-stat-label">Total Cartas</div>
            </div>
            <div class="spread-stat">
                <div class="spread-stat-value">${filledCards}</div>
                <div class="spread-stat-label">Seleccionadas</div>
            </div>
            <div class="spread-stat">
                <div class="spread-stat-value">${uprightCards}</div>
                <div class="spread-stat-label">En Derecha</div>
            </div>
            <div class="spread-stat">
                <div class="spread-stat-value">${reversedCards}</div>
                <div class="spread-stat-label">En Reversa</div>
            </div>
        </div>
        
        <div class="stats-cards" style="margin: 20px 0; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));">
            <div class="stat-card">
                <div class="stat-value">${spreadStats.majorArcana}</div>
                <div class="stat-label">Arcanos Mayores</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${spreadStats.minorArcana}</div>
                <div class="stat-label">Arcanos Menores</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${spreadStats.courtCards}</div>
                <div class="stat-label">Cartas de Corte</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${Math.round(spreadStats.reversalPercentage)}%</div>
                <div class="stat-label">En Reversa</div>
            </div>
        </div>
        
        <div class="section-title">CARTAS DE LA TIRADA</div>
        <div class="spread-cards-grid">
            ${createSpreadCardsHTML(spreadCards, entry.spread_type_id)}
        </div>
    `;
}

function closeEntryDetailsModal() {
    closeAllModals();
}



        async function deleteEntryById(entryId) {
            try {
                const searchId = parseInt(entryId);
                
                const { error } = await supabase
                    .from('log_entries')
                    .delete()
                    .eq('id', searchId);

                if (error) throw error;
                
                logHistory = logHistory.filter(entry => parseInt(entry.id) !== searchId);
                displayLogHistory();
                
                alert('Entrada eliminada correctamente');
                
            } catch (error) {
                console.error('Error al eliminar en Supabase:', error);
                alert('Error al eliminar: ' + error.message);
            }
        }

        function clearCurrentEntry() {
            const now = new Date();
            const normalizedNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            document.getElementById('practice-date').valueAsDate = normalizedNow;
            
            document.getElementById('practice-notes').value = '';
            currentLogEntry.notes = '';
            
            document.getElementById('tarot-card-select').value = '';
            document.getElementById('tarot-orientation').value = 'upright';
            document.getElementById('selected-tarot-card').innerHTML = '';
            currentLogEntry.tarotCard = null;
            currentLogEntry.tarotOrientation = 'upright';
            
            currentSpreadType = null;
            currentLogEntry.spreadType = null;
            currentLogEntry.spreadCards = [];
            document.getElementById('selected-spread-positions').innerHTML = '';
            updateSpreadTypesList();
        }


        // ===== FUNCIONES PARA ESTADÍSTICAS DE TIRADAS =====

function calculateSpreadStatistics(spreadCards) {
    if (!spreadCards || !Array.isArray(spreadCards)) {
        return {
            majorArcana: 0,
            minorArcana: 0,
            courtCards: 0,
            reversalPercentage: 0
        };
    }

    const stats = {
        majorArcana: 0,
        minorArcana: 0,
        courtCards: 0,
        reversalPercentage: 0
    };
    
    const validCards = spreadCards.filter(card => card && card.card);
    const totalValidCards = validCards.length;
    
    if (totalValidCards === 0) return stats;
    
    validCards.forEach(card => {
        const cardData = card.card;
        
        // Determinar tipo de carta
        if (cardData.Suit === 'Major Arcana') {
            stats.majorArcana++;
        } else if (['Page', 'Knight', 'Queen', 'King'].some(title => cardData.Name.includes(title))) {
            stats.courtCards++;
        } else {
            stats.minorArcana++;
        }
    });
    
    // Calcular porcentaje de reversas
    const reversedCards = validCards.filter(card => card.orientation === 'reversed').length;
    stats.reversalPercentage = totalValidCards > 0 ? (reversedCards / totalValidCards) * 100 : 0;
    
    return stats;
}

function createSpreadCardsHTML(spreadCards, spreadTypeId) {
    if (!spreadCards || spreadCards.length === 0) {
        return '<div class="empty-position">No hay cartas registradas en esta tirada</div>';
    }
    
    let html = '';
    
    spreadCards.forEach((cardData, index) => {
        if (!cardData || !cardData.card) {
            html += `
                <div class="spread-card-position">
                    <div class="position-header">
                        <div class="position-name">Posición ${index + 1}</div>
                    </div>
                    <div class="empty-position">Sin carta seleccionada</div>
                </div>
            `;
            return;
        }
        
        const card = cardData.card;
        const orientation = cardData.orientation === 'reversed' ? 'Reversa' : 'Derecha';
        const orientationClass = cardData.orientation === 'reversed' ? 'reversed' : 'upright';
        
        html += `
            <div class="spread-card-position">
                <div class="position-header">
                    <div class="position-name">${cardData.position || `Posición ${index + 1}`}</div>
                </div>
                <div class="spread-card-details">
                    <div class="spread-card-name">${card.Name}</div>
                    <div class="spread-card-orientation ${orientationClass}">${orientation}</div>
                </div>
                <div class="spread-card-info">
                    <span>${card.Suit}</span>
                    ${card.Element ? `<span>${card.Element}</span>` : ''}
                    ${card.Planet ? `<span>${card.Planet}</span>` : ''}
                    ${card.Sign ? `<span>${card.Sign}</span>` : ''}
                </div>
            </div>
        `;
    });
    
    return html;
}

function showSpreadInfoModal(entry) {
    const spreadCards = entry.spread_cards || [];
    const totalCards = spreadCards.length;
    const filledCards = spreadCards.filter(card => card && card.card).length;
    const uprightCards = spreadCards.filter(card => card && card.card && card.orientation === 'upright').length;
    const reversedCards = spreadCards.filter(card => card && card.card && card.orientation === 'reversed').length;
    const spreadStats = calculateSpreadStatistics(spreadCards);
    
    const modalHTML = `
        <div class="spread-modal-overlay" id="spread-info-modal">
            <div class="spread-modal-content">
                <div class="modal-header">
                    <div class="spread-modal-title">
                        Tirada: ${entry.spread_name || 'Personalizada'}
                    </div>
                    <button class="spread-modal-close" id="spread-modal-close">&times;</button>
                </div>
                
                <div class="spread-date">
                    ${formatDateForDisplay(entry.date)}
                </div>
                
                <div class="spread-stats">
                    <div class="spread-stat">
                        <div class="spread-stat-value">${totalCards}</div>
                        <div class="spread-stat-label">Total Cartas</div>
                    </div>
                    <div class="spread-stat">
                        <div class="spread-stat-value">${filledCards}</div>
                        <div class="spread-stat-label">Seleccionadas</div>
                    </div>
                    <div class="spread-stat">
                        <div class="spread-stat-value">${uprightCards}</div>
                        <div class="spread-stat-label">En Derecha</div>
                    </div>
                    <div class="spread-stat">
                        <div class="spread-stat-value">${reversedCards}</div>
                        <div class="spread-stat-label">En Reversa</div>
                    </div>
                </div>
                
                <div class="stats-cards" style="margin: 20px 0; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));">
                    <div class="stat-card">
                        <div class="stat-value">${spreadStats.majorArcana}</div>
                        <div class="stat-label">Arcanos Mayores</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${spreadStats.minorArcana}</div>
                        <div class="stat-label">Arcanos Menores</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${spreadStats.courtCards}</div>
                        <div class="stat-label">Cartas de Corte</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${Math.round(spreadStats.reversalPercentage)}%</div>
                        <div class="stat-label">En Reversa</div>
                    </div>
                </div>
                
                <div class="section-title">CARTAS DE LA TIRADA</div>
                <div class="spread-cards-grid">
                    ${createSpreadCardsHTML(spreadCards, entry.spread_type_id)}
                </div>
                
                <div class="modal-actions" style="margin-top: 25px; display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn-primary" id="close-spread-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupSpreadModalEvents();
}

function setupSpreadModalEvents() {
    const closeBtn = document.getElementById('spread-modal-close');
    const closeModalBtn = document.getElementById('close-spread-modal');
    const modal = document.getElementById('spread-info-modal');
    
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
    
    // Cerrar con tecla Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', escHandler);
}