// ===== FUNCIONES DE MODALES =====
function showDailyCardModal() {
    const modalHTML = `
        <div class="modal-overlay" id="daily-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Carta del Día</div>
                    <button class="close-modal" style="font-size: 1rem; font-weight: 600;">&times;</button>
                </div>
                
                <div class="daily-form">
                    <div class="form-group">
                        <label class="form-label">Fecha</label>
                        <input type="date" class="form-input" id="daily-date" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                    

                    
                    <div class="form-group">
                        <label class="form-label">Seleccionar Carta</label>
                        <select class="form-select" id="daily-tarot-card-select">
                            <option value="">Seleccionar carta...</option>
                            ${typeof tarotCards !== 'undefined' ? 
                                Object.values(tarotCards).map(card => 
                                    `<option value="${card.ID}">${card.Name}</option>`
                                ).join('') : ''}
                        </select>
                    </div>

                    <div id="selected-daily-tarot-card" class="selected-card-display"></div>

                    
                    <div class="form-group">
                        <label class="form-label">Orientación</label>
                        <select class="form-select" id="daily-tarot-orientation">
                            <option value="upright">Derecha</option>
                            <option value="reversed">Reversa</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Notas</label>
                        <textarea class="form-textarea" id="daily-notes" placeholder="Escribe tus reflexiones sobre esta carta..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Mazo</label>
                        <select class="form-select" id="daily-deck-select">
                            <option value="default">Mazo Predeterminado</option>
                            ${decks.map(deck => 
                                `<option value="${deck.id}" ${deck.is_default ? 'selected' : ''}>${deck.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn-secondary" id="clear-daily">Limpiar</button>
                        <button class="btn-primary" id="save-daily">Guardar Carta del Día</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupDailyModalEvents();
    initializeDailyForm();
}

function setupDailyModalEvents() {
    // Cerrar modal
    document.querySelector('#daily-modal .close-modal').addEventListener('click', closeDailyModal);
    document.getElementById('daily-modal').addEventListener('click', function(e) {
        if (e.target === this) closeDailyModal();
    });
    
    // Botones de acción
    document.getElementById('save-daily').addEventListener('click', saveDailyEntry);
    document.getElementById('clear-daily').addEventListener('click', clearDailyForm);
    
    // Eventos de formulario
    document.getElementById('daily-tarot-orientation').addEventListener('change', function() {
        currentDailyEntry.tarotOrientation = this.value;
        updateDailyTarotCardDisplay();
    });
    
    document.getElementById('daily-tarot-card-select').addEventListener('change', function() {
        const cardId = this.value;
        if (cardId && typeof tarotCards !== 'undefined') {
            currentDailyEntry.tarotCard = tarotCards[cardId];
            updateDailyTarotCardDisplay();
        } else {
            currentDailyEntry.tarotCard = null;
            document.getElementById('selected-daily-tarot-card').innerHTML = '';
        }
    });
}

function closeDailyModal() {
    const modal = document.getElementById('daily-modal');
    if (modal) modal.remove();
}


function initializeDailyForm() {
    // Inicializar valores por defecto
    document.getElementById('daily-date').valueAsDate = new Date();
    document.getElementById('daily-notes').value = '';
    document.getElementById('daily-tarot-card-select').value = '';
    document.getElementById('daily-tarot-orientation').value = 'upright';
    document.getElementById('daily-deck-select').value = currentDailyEntry.deckId;
    document.getElementById('selected-daily-tarot-card').innerHTML = '';
    
    // Reiniciar la entrada actual
    currentDailyEntry = {
        date: new Date(),
        notes: "",
        tarotCard: null,
        tarotOrientation: 'upright',
        deckId: document.getElementById('daily-deck-select').value
    };
    
    console.log('✅ Formulario diario inicializado correctamente');
}

function clearDailyForm() {
    currentDailyEntry = {
        date: new Date(),
        notes: "",
        tarotCard: null,
        tarotOrientation: 'upright',
        deckId: 'default'
    };
    
    document.getElementById('daily-date').valueAsDate = new Date();
    document.getElementById('daily-notes').value = '';
    document.getElementById('daily-tarot-card-select').value = '';
    document.getElementById('daily-tarot-orientation').value = 'upright';
    document.getElementById('daily-deck-select').value = currentDailyEntry.deckId;
    document.getElementById('selected-daily-tarot-card').innerHTML = '';
    
    console.log('🗑️ Formulario diario limpiado');
}

function updateDailyTarotCardDisplay() {
    const displayElement = document.getElementById('selected-daily-tarot-card');
    
    if (currentDailyEntry.tarotCard) {
        const card = currentDailyEntry.tarotCard;
        const orientation = currentDailyEntry.tarotOrientation;
        const orientationText = orientation === 'upright' ? 'Derecha' : 'Reversa';
        
        // Mapeo de símbolos
        const symbolMap = {
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
            'Uranus': 'X',
            'Neptune': 'Y',
            'Pluto': 'Z',
            
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
            'Pisces': 'L'
        };
        
        // Obtener símbolos
        const elementSymbol = card.Element ? symbolMap[card.Element] || card.Element : '';
        const planetSymbol = card.Planet ? symbolMap[card.Planet] || card.Planet : '';
        const signSymbol = card.Sign ? symbolMap[card.Sign] || card.Sign : '';
        
        displayElement.innerHTML = `
            <div class="selected-tarot-card">
                <div class="tarot-card-display">
                    <div class="form-label" style="color: var(--secondary-color)">${card.Name}</div>
                    <div class="tarot-card-details">
                        <div class="tarot-card-detail">${card.Suit}</div>
                        ${elementSymbol ? `<div class="tarot-card-symbol" title="${card.Element}">${elementSymbol}</div>` : ''}
                        ${planetSymbol ? `<div class="tarot-card-symbol" title="${card.Planet}">${planetSymbol}</div>` : ''}
                        ${signSymbol ? `<div class="tarot-card-symbol" title="${card.Sign}">${signSymbol}</div>` : ''}
                    </div>
                    <button type="button" class="remove-tarot-card">×</button>
                </div>
            </div>
        `;
        
        displayElement.querySelector('.remove-tarot-card').addEventListener('click', function() {
            currentDailyEntry.tarotCard = null;
            document.getElementById('daily-tarot-card-select').value = '';
            displayElement.innerHTML = '';
            console.log('❌ Carta removida del formulario diario');
        });
    }
}

async function saveDailyEntry() {
    const dateInput = document.getElementById('daily-date').value;
    let entryDate;

    if (dateInput) {
        const [year, month, day] = dateInput.split('-');
        entryDate = new Date(year, month - 1, day);
    } else {
        entryDate = new Date();
    }

    currentDailyEntry.date = entryDate;
    currentDailyEntry.notes = document.getElementById('daily-notes').value;
    currentDailyEntry.deckId = document.getElementById('daily-deck-select').value;

    if (!currentDailyEntry.tarotCard) {
        alert('Por favor, selecciona una carta de tarot');
        return;
    }

    const entryData = {
        date: currentDailyEntry.date.toISOString(),
        notes: currentDailyEntry.notes,
        deck_id: currentDailyEntry.deckId,
        entry_type: 'daily',
        tarot_card: currentDailyEntry.tarotCard,
        tarot_orientation: currentDailyEntry.tarotOrientation
    };

    try {
        const { data, error } = await supabase
            .from('log_entries')
            .upsert([entryData]);

        if (error) throw error;

        console.log('Entrada diaria guardada en Supabase:', data);

        await loadLogHistory();
        clearDailyForm();
        closeDailyModal();

        alert('Carta del día guardada correctamente');

    } catch (error) {
        console.error('Error al guardar carta del día:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// ===== MODIFICAR EL setupFooterMenu PARA USAR EL NUEVO MODAL =====
function setupFooterMenu() {
    const burgerBtn = document.getElementById('burger-menu-btn');
    const menuOptions = document.getElementById('footer-menu-options');
    const newDailyCard = document.getElementById('new-daily-card');
    const newSpread = document.getElementById('new-spread');
    const manageDecks = document.getElementById('manage-decks');
    const manageSpreads = document.getElementById('manage-spreads');
    
    // Alternar menú al hacer clic en el botón hamburguesa
    if (burgerBtn) {
        burgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menuOptions.classList.toggle('show');
        });
    }
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function() {
        menuOptions.classList.remove('show');
    });
    
    // Prevenir que el menú se cierre al hacer clic en él
    if (menuOptions) {
        menuOptions.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Funcionalidad para las opciones del menú
    if (newDailyCard) {
        newDailyCard.addEventListener('click', function() {
            // Mostrar modal para carta del día
            showDailyCardModal();
            menuOptions.classList.remove('show');
        });
    }
            
    if (newSpread) {
        newSpread.addEventListener('click', function() {
            // Mostrar formulario/modal para tirada (mantener el existente por ahora)
            // spreadForm.classList.add('show');
            // dailyForm.classList.remove('show');
            menuOptions.classList.remove('show');
            // initializeSpreadForm();
            alert('Funcionalidad de tiradas en desarrollo');
        });
    }
    
    if (manageDecks) {
        manageDecks.addEventListener('click', function() {
            // Mostrar modal de gestión de mazos
            showManageDecksModal();
            menuOptions.classList.remove('show');
        });
    }
    
    if (manageSpreads) {
        manageSpreads.addEventListener('click', function() {
            // Mostrar modal de gestión de tiradas
            // showManageSpreadsModal();
            menuOptions.classList.remove('show');
            alert('Gestión de tiradas en desarrollo');
        });
    }
}

// ===== ESTILOS CSS RECOMENDADOS PARA LOS NUEVOS MODALES =====
/*
.selected-card-display {
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.tarot-card-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
    border-left: 4px solid #b56576;
}

.tarot-card-name {
    font-weight: 600;
    color: #2d3748;
}

.tarot-card-details {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.tarot-card-detail {
    padding: 0.25rem 0.5rem;
    background: #e9ecef;
    border-radius: 4px;
    font-size: 0.875rem;
    color: #495057;
}

.remove-tarot-card {
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
}

.remove-tarot-card:hover {
    background: #c82333;
}
*/