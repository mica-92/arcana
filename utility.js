// ===== FUNCIONES DE BASE DE DATOS =====
async function loadDecks() {
    try {
        const { data, error } = await supabase
            .from('decks')
            .select('*')
            .order('name');

        if (error) throw error;

        if (data) {
            decks = data;
            updateDeckSelectors();
        }
    } catch (error) {
        console.error('Error al cargar decks:', error);
        decks = [{
            id: 'default',
            name: 'Rider Waite Smith Centennial',
            purchase_date: '11.2023',
            extra_cards: 'N/A',
            name_changes: 'N/A',
            card_types: 'All',
            is_default: true,
            card_mappings: {}
        }];
        updateDeckSelectors();
    }
}

// ===== FUNCIÓN PARA CARGAR TIPOS DE TIRADA =====
async function loadSpreadTypes() {
    try {
        console.log('Cargando tipos de tirada desde Supabase...');
        
        const { data, error } = await supabase
            .from('spread_types')
            .select('*')
            .order('name');

        if (error) throw error;

        if (data && data.length > 0) {
            spreadTypes = data;
            console.log('Tipos de tirada cargados:', spreadTypes.length);
            
            // Asegurarse de que las posiciones estén en el formato correcto
            spreadTypes.forEach(spread => {
                if (typeof spread.positions === 'string') {
                    try {
                        spread.positions = JSON.parse(spread.positions);
                    } catch (e) {
                        console.warn(`Error parseando posiciones para ${spread.name}:`, e);
                        // Si falla el parseo, crear posiciones por defecto
                        spread.positions = Array.from({length: spread.card_count}, (_, i) => `Posición ${i + 1}`);
                    }
                }
                
                // Si no hay posiciones, crearlas
                if (!spread.positions || spread.positions.length === 0) {
                    spread.positions = Array.from({length: spread.card_count}, (_, i) => `Posición ${i + 1}`);
                }
            });
        } else {
            console.log('No se encontraron tiradas en Supabase, usando datos por defecto');
            spreadTypes = getDefaultSpreadTypes();
        }
        
        // Actualizar la lista visual si estamos en el formulario de tiradas
        if (document.getElementById('spread-types-list')) {
            updateSpreadTypesList();
        }
        
        return spreadTypes;
        
    } catch (error) {
        console.error('Error al cargar tipos de tiradas:', error);
        spreadTypes = getDefaultSpreadTypes();
        
        if (document.getElementById('spread-types-list')) {
            updateSpreadTypesList();
        }
        
        return spreadTypes;
    }
}

// Función para obtener tiradas por defecto
function getDefaultSpreadTypes() {
    return [
        {
            id: 'default-3card',
            name: 'Pasado-Presente-Futuro',
            card_count: 3,
            positions: ['Pasado', 'Presente', 'Futuro'],
            description: 'Tirada clásica de 3 cartas',
            tags: 'Básica,Clásica',
            deck_id: 'default'
        },
        {
            id: 'default-luna',
            name: 'Luna',
            card_count: 3,
            positions: ['Lo consciente', 'Lo subconsciente', 'La síntesis'],
            description: 'Tirada de influencia lunar',
            tags: 'Astrología,Lunar',
            deck_id: 'default'
        },
        {
            id: 'default-celtic',
            name: 'Cruz Celta',
            card_count: 10,
            positions: [
                '1: La situación actual',
                '2: Los desafíos',
                '3: La base',
                '4: El pasado reciente',
                '5: Metas y aspiraciones',
                '6: El futuro próximo',
                '7: Tu actitud',
                '8: Influencias externas',
                '9: Esperanzas y temores',
                '10: Resultado final'
            ],
            description: 'Tirada tradicional de Cruz Celta',
            tags: 'Avanzada,Tradicional',
            deck_id: 'default'
        }
    ];
}

// ===== ACTUALIZAR SELECTORES DE MAZO CORREGIDO =====
function updateDeckSelectors() {
    // Actualizar selector en formulario diario
    const dailyDeckSelect = document.getElementById('daily-deck-select');
    const spreadDeckSelect = document.getElementById('spread-deck-select');
    
    if (dailyDeckSelect) {
        dailyDeckSelect.innerHTML = '';
    }
    
    if (spreadDeckSelect) {
        spreadDeckSelect.innerHTML = '';
    }
    
    decks.forEach(deck => {
        // Para formulario diario
        if (dailyDeckSelect) {
            const dailyOption = document.createElement('option');
            dailyOption.value = deck.id;
            dailyOption.textContent = deck.name;
            if (deck.is_default) {
                dailyOption.textContent += ' (Por defecto)';
            }
            dailyDeckSelect.appendChild(dailyOption);
        }
        
        // Para formulario de tirada
        if (spreadDeckSelect) {
            const spreadOption = document.createElement('option');
            spreadOption.value = deck.id;
            spreadOption.textContent = deck.name;
            if (deck.is_default) {
                spreadOption.textContent += ' (Por defecto)';
            }
            spreadDeckSelect.appendChild(spreadOption);
        }
    });
    
    // Establecer valores por defecto
    const defaultDeck = decks.find(deck => deck.is_default);
    if (defaultDeck) {
        if (dailyDeckSelect) {
            dailyDeckSelect.value = defaultDeck.id;
            currentDailyEntry.deckId = defaultDeck.id;
        }
        
        if (spreadDeckSelect) {
            spreadDeckSelect.value = defaultDeck.id;
            currentSpreadEntry.deckId = defaultDeck.id;
            currentDeckId = defaultDeck.id; // ¡IMPORTANTE! Actualizar currentDeckId
        }
    }
}

