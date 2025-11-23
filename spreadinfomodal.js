// ===== FUNCIONES FALTANTES PARA EL MODAL DE TIRADAS =====

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
                
                <div class="stats-cards">
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