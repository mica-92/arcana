// ===== ESTRUCTURA DE PROPIEDADES DEL TAROT =====
const tarotProperties = {
    "Suit": {
        "Majors": "Los Arcanos Mayores representan lecciones kármicas y espirituales, arquetipos universales y eventos significativos en la vida.",
        "Wands": "Representan la creatividad, la energía, la inspiración y la acción. Elemento Fuego.",
        "Cups": "Simbolizan las emociones, los sentimientos, el amor y las relaciones. Elemento Agua.",
        "Swords": "Relacionados con la mente, el intelecto, la verdad y los conflictos. Elemento Aire.",
        "Pentacles": "Conectados con lo material, el trabajo, el dinero y la seguridad. Elemento Tierra."
    },
    "Type": {
        "Majors": "Cartas de mayor significado espiritual y evolutivo en el viaje del alma."
    },
    "Numerology": {
        "0": "Potencial puro, infinitas posibilidades, el viaje comienza.",
        "1": "Inicio, individualidad, acción, potencial manifestándose.",
        "2": "Unión, equilibrio, elecciones, receptividad."
    },
    "Planet": {
        "Urano": "Planeta de la innovación, la sorpresa y la libertad.",
        "Mercurio": "Planeta de la comunicación, el intelecto y el intercambio.",
        "Luna": "Representa lo emocional, lo intuitivo y lo cíclico.",
        "Sol": "Símbolo de vitalidad, conciencia y éxito.",
        "Venus": "Planeta del amor, la belleza y la armonía.",
        "Tierra": "Representa la materialización, lo práctico y lo estable."
    },
    "Sign": {
        "Acuario": "Signo de la innovación, la comunidad y la originalidad.",
        "Géminis": "Signo de la comunicación, la adaptabilidad y la curiosidad.",
        "Cáncer": "Signo de la emocionalidad, la protección y el hogar."
    },
    "Element": {
        "Aire": "Elemento del intelecto, la comunicación y el pensamiento.",
        "Agua": "Elemento de las emociones, la intuición y los sentimientos.",
        "Fuego": "Elemento de la energía, la pasión y la acción.",
        "Tierra": "Elemento de la materialización, la practicidad y la estabilidad."
    },
    "Septenary": {
        "Libertad": "Representa la liberación de ataduras y el comienzo de nuevos caminos.",
        "Manifestación": "Capacidad de materializar ideas y proyectos.",
        "Intuición": "Desarrollo de la percepción más allá de lo racional.",
        "Inspiración": "Flujo creativo y conexión con fuentes superiores.",
        "Amor": "Energía de unión, compasión y conexión emocional.",
        "Verdad": "Búsqueda y expresión de la autenticidad.",
        "Abundancia": "Flujo de recursos materiales y espirituales."
    },
    "Vertical": {
        "Inicio": "Punto de partida, potencial por desarrollar.",
        "Acción": "Energía de movimiento y manifestación.",
        "Recepción": "Estado de apertura y aceptación.",
        "Potencial": "Energía latente esperando manifestarse.",
        "Emoción": "Estado afectivo y sentimental.",
        "Mente": "Actividad intelectual y racional.",
        "Manifestación": "Materialización de ideas y proyectos."
    }
};

// ===== FUNCIONES PRINCIPALES =====

let tarotCardNotes = {};

// Cargar notas de cartas desde Supabase (simulado para la demo)
async function loadTarotCardNotes() {
    try {
        // En una implementación real, esto cargaría desde Supabase
        console.log('Notas de cartas cargadas');
        // Simulamos algunas notas para la demo
        tarotCardNotes = {
            "major-0": { id: 1, card_id: "major-0", notes: "Notas sobre El Loco", updated_at: new Date().toISOString() },
            "wand-1": { id: 2, card_id: "wand-1", notes: "Notas sobre As de Bastos", updated_at: new Date().toISOString() }
        };
    } catch (error) {
        console.error('Error al cargar notas de cartas:', error);
    }
}

// Guardar/actualizar notas de carta (simulado para la demo)
async function saveTarotCardNotes(cardId, notes) {
    try {
        // En una implementación real, esto guardaría en Supabase
        console.log(`Guardando notas para ${cardId}:`, notes);
        
        // Simulación de guardado exitoso
        tarotCardNotes[cardId] = {
            id: Object.keys(tarotCardNotes).length + 1,
            card_id: cardId,
            notes: notes,
            updated_at: new Date().toISOString()
        };
        
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

    // Obtener todas las propiedades agrupadas por tipo
    const groupedProperties = getGroupedProperties();

    let html = `
        <div class="tarot-categories">
            <div class="property-section">
                <h3 class="history-title">Propiedades de las Cartas</h3>
                ${Object.entries(groupedProperties).map(([propertyType, values]) => `
                    <div class="property-group">
                        <h4 class="history-subtitle">${propertyType}</h4>
                        <div class="property-values">
                            ${values.map(value => `
                                <span class="property-value-tag" 
                                      data-property-type="${propertyType}" 
                                      data-property-value="${value}">
                                    ${value}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
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
    setupPropertyTagEvents();
}

// Obtener propiedades agrupadas por tipo
function getGroupedProperties() {
    const grouped = {};
    const propertyTypes = ['Suit', 'Type', 'Numerology', 'Planet', 'Sign', 'Element', 'Septenary', 'Vertical'];
    
    propertyTypes.forEach(type => {
        const values = new Set();
        
        Object.values(tarotCards).forEach(card => {
            if (card[type]) {
                values.add(card[type]);
            }
        });
        
        if (values.size > 0) {
            grouped[type] = Array.from(values);
        }
    });
    
    return grouped;
}

// Crear botón de carta
function createCardButton(card) {
    const hasNotes = tarotCardNotes[card.ID] && tarotCardNotes[card.ID].notes;
    
    return `
        <button class="tarot-card-btn" data-card-id="${card.ID}">
            <div class="card-name">${card.Name}</div>
            ${hasNotes ? '<div class="card-has-notes">📝</div>' : ''}
        </button>
    `;
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

// Configurar eventos de las etiquetas de propiedades
function setupPropertyTagEvents() {
    document.querySelectorAll('.property-value-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const propertyType = this.getAttribute('data-property-type');
            const propertyValue = this.getAttribute('data-property-value');
            
            showCardsWithPropertyModal(propertyType, propertyValue);
        });
    });
}

// Mostrar modal de carta detallada
function showTarotCardModal(card) {
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
                            ${card.Suit ? `
                            <div class="property">
                                <span class="property-label">Palo:</span>
                                <span class="property-value clickable" data-property-type="Suit" data-property-value="${card.Suit}">${card.Suit}</span>
                            </div>
                            ` : ''}
                            ${card.Type ? `
                            <div class="property">
                                <span class="property-label">Tipo:</span>
                                <span class="property-value clickable" data-property-type="Type" data-property-value="${card.Type}">${card.Type}</span>
                            </div>
                            ` : ''}
                            ${card.Numerology ? `
                            <div class="property">
                                <span class="property-label">Numerología:</span>
                                <span class="property-value clickable" data-property-type="Numerology" data-property-value="${card.Numerology}">${card.Numerology}</span>
                            </div>
                            ` : ''}
                            ${card.Planet ? `
                            <div class="property">
                                <span class="property-label">Planeta:</span>
                                <span class="property-value clickable" data-property-type="Planet" data-property-value="${card.Planet}">${card.Planet}</span>
                            </div>
                            ` : ''}
                            ${card.Sign ? `
                            <div class="property">
                                <span class="property-label">Signo:</span>
                                <span class="property-value clickable" data-property-type="Sign" data-property-value="${card.Sign}">${card.Sign}</span>
                            </div>
                            ` : ''}
                            ${card.Element ? `
                            <div class="property">
                                <span class="property-label">Elemento:</span>
                                <span class="property-value clickable" data-property-type="Element" data-property-value="${card.Element}">${card.Element}</span>
                            </div>
                            ` : ''}
                            ${card.Septenary ? `
                            <div class="property">
                                <span class="property-label">Septenary:</span>
                                <span class="property-value clickable" data-property-type="Septenary" data-property-value="${card.Septenary}">${card.Septenary}</span>
                            </div>
                            ` : ''}
                            ${card.Vertical ? `
                            <div class="property">
                                <span class="property-label">Vertical:</span>
                                <span class="property-value clickable" data-property-type="Vertical" data-property-value="${card.Vertical}">${card.Vertical}</span>
                            </div>
                            ` : ''}
                        </div>
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
    setupPropertyValueClickEvents();
}

// Mostrar modal con cartas que tienen una propiedad específica
function showCardsWithPropertyModal(propertyType, propertyValue) {
    const cardsWithProperty = Object.values(tarotCards).filter(card => 
        card[propertyType] === propertyValue
    );
    
    // Obtener descripción de la propiedad
    const propertyDescription = getPropertyDescription(propertyType, propertyValue);
    
    const modalHTML = `
        <div class="modal-overlay" id="property-cards-modal">
            <div class="modal-content tarot-card-modal-content">
                <div class="modal-header">
                    <div class="modal-title">${propertyType}: ${propertyValue}</div>
                    <button class="close-modal" id="property-cards-close">&times;</button>
                </div>
                
                <div class="tarot-card-details">
                    <div class="property-description">
                        <h4 class="section-title">Descripción</h4>
                        <p>${propertyDescription}</p>
                    </div>
                    
                    <div class="cards-with-property">
                        <h4 class="section-title">Cartas con esta propiedad (${cardsWithProperty.length})</h4>
                        <div class="cards-with-property-list">
                            ${cardsWithProperty.length > 0 ? 
                                cardsWithProperty.map(card => `
                                    <div class="card-in-list" data-card-id="${card.ID}">
                                        <strong>${card.Name}</strong>
                                        ${card.Suit && card.Suit !== propertyValue ? ` - ${card.Suit}` : ''}
                                        ${card.Type && card.Type !== propertyValue ? ` - ${card.Type}` : ''}
                                    </div>
                                `).join('') 
                                : '<p>No hay cartas con esta propiedad</p>'
                            }
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-secondary" id="close-property-cards-modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupPropertyCardsModalEvents();
}

// Obtener descripción de una propiedad
function getPropertyDescription(propertyType, propertyValue) {
    if (tarotProperties[propertyType] && tarotProperties[propertyType][propertyValue]) {
        return tarotProperties[propertyType][propertyValue];
    }
    return "No hay descripción disponible para esta propiedad.";
}

// Configurar eventos del modal de propiedad
function setupPropertyCardsModalEvents() {
    const modal = document.getElementById('property-cards-modal');
    const closeBtn = document.getElementById('property-cards-close');
    const closeModalBtn = document.getElementById('close-property-cards-modal');
    
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
    
    // Configurar clic en las cartas de la lista
    document.querySelectorAll('.card-in-list').forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.getAttribute('data-card-id');
            const card = tarotCards[cardId];
            if (card) {
                closeModal();
                showTarotCardModal(card);
            }
        });
    });
    
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

// Configurar eventos de clic en valores de propiedad
function setupPropertyValueClickEvents() {
    document.querySelectorAll('.property-value.clickable').forEach(element => {
        element.addEventListener('click', function() {
            const propertyType = this.getAttribute('data-property-type');
            const propertyValue = this.getAttribute('data-property-value');
            
            // Cerrar el modal actual
            const currentModal = document.getElementById('tarot-card-modal');
            if (currentModal) currentModal.remove();
            
            // Mostrar modal con cartas que tienen esta propiedad
            showCardsWithPropertyModal(propertyType, propertyValue);
        });
    });
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

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', initializeTarotGuide);