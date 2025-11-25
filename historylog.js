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

function setupHistoryEventListeners() {
    // Manejo de tabs
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('history-tab')) {
            document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            displayLogHistory();
        }
    });
    
    // Manejo de clic en entradas del historial - MODIFICADO
    document.addEventListener('click', function(e) {
        const entryElement = e.target.closest('.log-entry');
        if (entryElement) {
            const entryId = entryElement.getAttribute('data-id');
            const entryType = entryElement.getAttribute('data-type');
            
            if (entryType === 'spread') {
                // Para tiradas, usar showSpreadInfoModal
                const entry = logHistory.find(e => parseInt(e.id) === parseInt(entryId));
                if (entry) {
                    showSpreadInfoModal(entry);
                }
            } else {
                // Para entradas diarias, usar el modal existente
                showEntryDetailsModal(entryId);
            }
        }
    });
}


// Modificar createEntryDetailsHTML para redirigir tiradas al modal completo
function createEntryDetailsHTML(entry) {
    let html = '';
    
    if (entry.entry_type === 'daily') {
        html += createDailyDetailsHTML(entry);
    } else {
        // Para tiradas, mostrar un mensaje y botón para ver el modal completo
        html += `
            <div style="text-align: center; padding: 20px;">
                <p>Esta es una tirada de tarot. Para ver las estadísticas completas y detalles:</p>
                <button class="btn-primary" onclick="showSpreadInfoModalFromDetails(${JSON.stringify(entry).replace(/"/g, '&quot;')})">
                    Ver Estadísticas Completas de la Tirada
                </button>
            </div>
        `;
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
                    <div class="modal-title">
                        ${entry.entry_type === 'daily' ? 'Carta del Día' : 'Tirada: ' + (entry.spread_name || 'Personalizada')}
                    </div>
                    <button class="spread-modal-close" id="entry-modal-close">&times;</button>
                </div>
                <div class="deck-form">
                <div class="spread-date">Fecha:
                    ${formatDateForDisplay(entry.date)}
                </div></div>
                <div class="modal-header-subtitle">
                    <div class="modal-subtitle">Carta del Día</div>
                </div>
                
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

function createDailyDetailsHTML(entry) {
    let cardHTML = '';
    
    if (entry.tarot_card) {
        let cardName = 'Carta desconocida';
        let cardSuit = '';
        let cardElement = '';
        let cardPlanet = '';
        let cardSign = '';
        
        // Mapeo de símbolos para mostrar iconos en lugar de texto
        const symbolMap = {
            // Orientación
            'upright': 'D',
            'reversed': 'R',
            'Derecha': 'D',
            'Reversa': 'R',
            
            // Palos
            'Major Arcana': 'y',
            'Wands': '±',
            'Cups': '³',
            'Swords': '²',
            'Pentacles': '´',
            'Court Cards': 'u',
            
            // Elementos
            'Fuego': '±',
            'Agua': '³', 
            'Aire': '²',
            'Tierra': '´',
            'Fire': '±',
            'Water': '³', 
            'Air': '²',
            'Earth': '´',
            
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
            'Pisces': 'L',
            
            // Tipos
            'Majors': 'y',
            'Minors': 't', 
            'Courts': 'u',
            
            // Septenary
            'First': '1',
            'Second': '2',
            'Third': '3',
            'Fourth': '4', 
            'Fifth': '5',
            'Sixth': '6',
            'Seventh': '7',
            
            // Numerology  
            'One': '1',
            'Two': '2',
            'Three': '3',
            'Four': '4',
            'Five': '5', 
            'Six': '6',
            'Seven': '7',
            'Eight': '8',
            'Nine': '9',
            'Ten': '10',
            
            // Court Types
            'Pages': '§',
            'Knights': '£',
            'Queens': '¢', 
            'Kings': '¦'
        };

        // Procesar información de la carta
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

        // Procesar orientación
        const orientation = entry.tarot_orientation || entry.orientation || 'upright';
        const isReversed = orientation === 'reversed' || orientation === 'Reversa';
        
        const suitSymbol = symbolMap[cardSuit] || cardSuit;
        const elementSymbol = symbolMap[cardElement] || cardElement;
        const planetSymbol = symbolMap[cardPlanet] || cardPlanet;
        const signSymbol = symbolMap[cardSign] || cardSign;

        cardHTML = `
        <div class="tarot-section">
            <div class="deck-item-name">
                <div class="deck-item" style="margin-bottom:10px;">
                    <div class="tarot-card-display">
                        <div class="tarot-card-header" style="display: flex; align-items: center; justify-content: flex-start; gap: 8px;">
                            <div class="position-name" style="color: var(--primary80);">${cardName}</div>
                            ${isReversed ? `
                            <div class="reversal-badge" style="font-family: 'Inconsolata', monospace; font-size: 0.8rem; background: var(--primary-color); height: 24px; width: 24px; color: white; padding: 2px 6px; border-radius: 50%; margin-left: 8px; display: flex; align-items: center; justify-content: center; box-sizing: border-box;" title="Carta Reversa">
                                R
                            </div>
                            ` : ''}
                        </div>
                        <div class="spread-card-info">
                            ${elementSymbol ? `<div title="Elemento" style="font-family:'Astronomicon'; font-weight: normal; font-size:20px;">${elementSymbol}</div>` : ''}
                            ${planetSymbol ? `<div title="Planeta" style="font-family:'Astronomicon'; font-weight: normal; font-size:20px;">${planetSymbol}</div>` : ''}
                            ${signSymbol ? `<div title="Signo Zodiacal" style="font-family:'Astronomicon'; font-weight: normal; font-size:20px;">${signSymbol}</div>` : ''}
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