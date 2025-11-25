function showSpreadInfoModal(entry) {
    console.log('🔍 Mostrando modal para tirada:', entry);
    
    // CERRAR CUALQUIER MODAL EXISTENTE PRIMERO
    const existingModal = document.getElementById('spread-info-modal');
    if (existingModal) {
        existingModal.remove();
        console.log('✅ Modal existente eliminado');
    }
    
    const spreadCards = entry.spread_cards || [];
    const totalCards = spreadCards.length;
    const validCards = spreadCards.filter(card => card && card.card);
    const totalValidCards = validCards.length;
    const uprightCards = validCards.filter(card => card.orientation === 'upright').length;
    const reversedCards = validCards.filter(card => card.orientation === 'reversed').length;
    const spreadStats = calculateSpreadStatistics(spreadCards);
    const detailedStats = calculateDetailedSpreadStatistics(spreadCards);
    
    console.log('📊 Estadísticas detalladas calculadas:', detailedStats);
    
    // Mapa de iconos para los símbolos
    const iconMap = {
        // Orientación
        'Derecha': '`',
        'Reversa': 'b',
        
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

    // Función helper para obtener el símbolo
    const getSymbol = (key) => iconMap[key] || '';

    const modalHTML = `
        <div class="spread-modal-overlay" id="spread-info-modal" onclick="if(event.target===this) closeSpreadModalFinal()">
            <div class="spread-modal-content">
                <div class="modal-header">
                    <div class="modal-title">
                        Tirada: ${entry.spread_name || 'Personalizada'}
                    </div>
                    <button class="spread-modal-close" id="spread-modal-close" onclick="closeSpreadModalFinal()">&times;</button>
                </div>
                
                <div class="form-label">
                    Fecha: ${formatDateForDisplay(entry.date)}
                </div>
                
                <div class="modal-header-subtitle">
                    <div class="modal-subtitle">Estadísticas de la Tirada</div>
                </div>
                
                <!-- CAMBIO AQUÍ: Reemplazar porcentaje por formato reversa/total -->
                <div class="stat-card">
                    <div class="stat-value">${reversedCards}/${totalValidCards}</div>
                    <div class="stat-label">En Reversa</div>
                </div>
                
                <!-- Estadísticas de tipos de cartas -->
                <div class="stats-cards" style="color: var(--secondary-color);">
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
                </div>

                <div class="modal-header-subtitle">
                    <div class="modal-subtitle">Estadísticas Detalladas</div>
                </div>

                <div class="stats-cards" style="color: var(--secondary-color);">
                    <!-- Elementos -->
                    <div class="stat-card">
                        <div class="stat-category-title" style="color: var(--secondary-color)">Elementos</div>
                        <div class="stat-category-items">
                            ${Object.keys(detailedStats.elements).length > 0 ? 
                                Object.entries(detailedStats.elements).map(([element, count]) => `
                                    <div class="stat-item">
                                        <span class="stat-item-label">
                                            ${getSymbol(element)} 
                                        </span>
                                        <span class="stat-item-value">${count}</span>
                                    </div>
                                `).join('') : 
                                '<div class="stat-item"><span class="stat-item-label" style="font-family:\'Inconsolata\'">No hay datos</span></div>'
                            }
                        </div>
                    </div>
                    
                    <!-- Planetas -->
                    <div class="stat-card">
                        <div class="stat-category-title" style="color: var(--secondary-color)">Planetas</div>
                        <div class="stat-category-items">
                            ${Object.keys(detailedStats.planets).length > 0 ? 
                                Object.entries(detailedStats.planets).map(([planet, count]) => `
                                    <div class="stat-item">
                                        <span class="stat-item-label">
                                            ${getSymbol(planet)}
                                        </span>
                                        <span class="stat-item-value">${count}</span>
                                    </div>
                                `).join('') : 
                                '<div class="stat-item"><span class="stat-item-label" style="font-family:\'Inconsolata\'">No hay datos</span></div>'
                            }
                        </div>
                    </div>
                    
                    <!-- Signos Zodiacales -->
                    <div class="stat-card">
                        <div class="stat-category-title" style="color: var(--secondary-color)">Signos</div>
                        <div class="stat-category-items">
                            ${Object.keys(detailedStats.signs).length > 0 ? 
                                Object.entries(detailedStats.signs).map(([sign, count]) => `
                                    <div class="stat-item">
                                        <span class="stat-item-label">
                                            ${getSymbol(sign)}
                                        </span>
                                        <span class="stat-item-value">${count}</span>
                                    </div>
                                `).join('') : 
                                '<div class="stat-item"><span class="stat-item-label" style="font-family:\'Inconsolata\'">No hay datos</span></div>'
                            }
                        </div>
                    </div>
                    
                    <!-- Numerología -->
                    <div class="stat-card">
                        <div class="stat-category-title" style="color: var(--secondary-color)">Numerología</div>
                        <div class="stat-category-items">
                            ${Object.keys(detailedStats.numerology).length > 0 ? 
                                Object.entries(detailedStats.numerology).map(([number, count]) => `
                                    <div class="stat-item">
                                        <span class="stat-item-label">${number}</span>
                                        <span class="stat-item-value">${count}</span>
                                    </div>
                                `).join('') : 
                                '<div class="stat-item"><span class="stat-item-label" style="font-family:\'Inconsolata\'">No hay datos</span></div>'
                            }
                        </div>
                    </div>
                </div>
                
                <div class="modal-header-subtitle">
                    <div class="modal-subtitle">Cartas de la Tirada</div>
                </div>
                
                <div class="spread-cards-grid">
    ${createSpreadCardsHTML(spreadCards, entry.spread_type_id, iconMap)}
                </div>
                
                <div class="modal-actions" style="margin-top: 25px; display: flex; gap: 10px; justify-content: flex-end;">
                    <button class="btn-secondary" id="close-spread-modal" onclick="closeSpreadModalFinal()">Cerrar</button>
                    <button class="btn-primary" onclick="deleteSpreadEntryFinal('${entry.id}')">Eliminar Entrada</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // SOLO UNA VEZ - Configurar evento de tecla Escape
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            console.log('⌨️ Escape presionado - cerrando modal');
            closeSpreadModalFinal();
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Guardar referencia para limpiar después
    window.currentSpreadModalEscapeHandler = escapeHandler;
    
    console.log('✅ Modal creado - SOLO EVENTOS INLINE, NO setupSpreadInfoModalEventsFunction');
}
// FUNCIÓN FINAL DE CIERRE - SOLO UNA VEZ
function closeSpreadModalFinal() {
    console.log('🔴 CERRANDO MODAL - FUNCIÓN FINAL');
    const modal = document.getElementById('spread-info-modal');
    if (modal) {
        console.log('✅ Modal encontrado, eliminando...');
        modal.remove();
        
        // Limpiar event listener de teclado
        if (window.currentSpreadModalEscapeHandler) {
            document.removeEventListener('keydown', window.currentSpreadModalEscapeHandler);
            console.log('✅ Event listener de teclado removido');
        }
        
        console.log('✅ Modal cerrado exitosamente - UN SOLO CLIC');
    } else {
        console.log('❌ Modal no encontrado');
    }
}

// Función para eliminar entrada
function deleteSpreadEntryFinal(entryId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
        console.log('🗑️ Eliminando entrada:', entryId);
        // Aquí llamar a tu función de eliminación existente
        deleteEntryById(entryId);
        closeSpreadModalFinal();
    }
}

// Función mejorada para estadísticas detalladas
function calculateDetailedSpreadStatistics(spreadCards) {
    console.log('📈 Calculando estadísticas detalladas para:', spreadCards);
    
    const stats = {
        elements: {},
        planets: {},
        signs: {},
        numerology: {},
        courtTypes: {}
    };
    
    const validCards = spreadCards.filter(card => card && card.card);
    
    console.log('🃏 Cartas válidas encontradas:', validCards.length);
    
    if (validCards.length === 0) {
        console.log('⚠️ No hay cartas válidas para calcular estadísticas');
        return stats;
    }
    
    validCards.forEach((card, index) => {
        const cardData = card.card;
        console.log(`📋 Procesando carta ${index + 1}:`, cardData.Name);
        
        // Elementos
        if (cardData.Element) {
            stats.elements[cardData.Element] = (stats.elements[cardData.Element] || 0) + 1;
            console.log(`✅ Elemento: ${cardData.Element}`);
        }
        
        // Planetas
        if (cardData.Planet) {
            stats.planets[cardData.Planet] = (stats.planets[cardData.Planet] || 0) + 1;
            console.log(`✅ Planeta: ${cardData.Planet}`);
        }
        
        // Signos Zodiacales
        if (cardData.Sign) {
            stats.signs[cardData.Sign] = (stats.signs[cardData.Sign] || 0) + 1;
            console.log(`✅ Signo: ${cardData.Sign}`);
        }
        
        // Numerología (extraer número del nombre)
        const numberMatch = cardData.Name.match(/\d+/);
        if (numberMatch) {
            const number = numberMatch[0];
            stats.numerology[number] = (stats.numerology[number] || 0) + 1;
            console.log(`✅ Número: ${number}`);
        } else {
            console.log(`ℹ️ No se encontró número en: ${cardData.Name}`);
        }
        
        // Tipos de Court Cards
        if (['Page', 'Knight', 'Queen', 'King'].some(title => cardData.Name.includes(title))) {
            let courtType = '';
            if (cardData.Name.includes('Page')) courtType = 'Pages';
            else if (cardData.Name.includes('Knight')) courtType = 'Knights';
            else if (cardData.Name.includes('Queen')) courtType = 'Queens';
            else if (cardData.Name.includes('King')) courtType = 'Kings';
            
            if (courtType) {
                stats.courtTypes[courtType] = (stats.courtTypes[courtType] || 0) + 1;
                console.log(`✅ Court Type: ${courtType}`);
            }
        }
    });
    
    console.log('📊 Resultado final de estadísticas:', stats);
    return stats;
}

// Mantener la función original de estadísticas básicas
function calculateSpreadStatistics(spreadCards) {
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

function createSpreadCardsHTML(spreadCards, spreadTypeId, iconMap) {
    if (!spreadCards || spreadCards.length === 0) {
        return '<div class="empty-position">No hay cartas registradas en esta tirada</div>';
    }

    const getSymbol = (key) => iconMap[key] || '';
    
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
        const isReversed = cardData.orientation === 'reversed';
        
        html += `
            <div class="deck-item">
                <div class="deck-item-name">${cardData.position || `Posición ${index + 1}`}</div>
                <div style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; margin-bottom: 8px;">
                    <div class="position-name" style="color: var(--primary80)">${card.Name}</div>
                    ${isReversed ? `
                    <div class="reversal-badge" style="font-family: 'Inconsolata', monospace; font-size: 0.8rem; background: var(--primary-color); height: 24px; width: 24px; color: white; padding: 2px 6px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-sizing: border-box;" title="Carta Reversa">
                        R
                    </div>
                    ` : ''}
                </div>
                <div class="spread-card-info" style="font-size: 20px; font-family: 'Astronomicon', 'Inconsolata', monospace;">
                    ${card.Element ? `<span>${getSymbol(card.Element)}</span>` : ''}
                    ${card.Planet ? `<span>${getSymbol(card.Planet)}</span>` : ''}
                    ${card.Sign ? `<span>${getSymbol(card.Sign)}</span>` : ''}
                </div>
            </div>
        `;
    });
    
    return html;
}