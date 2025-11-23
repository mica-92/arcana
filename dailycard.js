// ===== INICIALIZACIÓN DE FORMULARIOS SEPARADOS =====
function initializeDailyForm() {
    const now = new Date();
    document.getElementById('daily-date').valueAsDate = now;
    
    // Inicializar selector de cartas para formulario diario
    const tarotSelect = document.getElementById('daily-tarot-card-select');
    tarotSelect.innerHTML = '<option value="">Seleccionar carta...</option>';
    
    if (typeof tarotCards !== 'undefined') {
        Object.values(tarotCards).forEach(card => {
            const option = document.createElement('option');
            option.value = card.ID;
            option.textContent = `${card.Name} (${card.Suit})`;
            tarotSelect.appendChild(option);
        });
    }
    
    // Event listeners para formulario diario
    document.getElementById('daily-tarot-orientation').addEventListener('change', function() {
        currentDailyEntry.tarotOrientation = this.value;
        updateDailyTarotCardDisplay();
    });
    
    tarotSelect.addEventListener('change', function() {
        const cardId = this.value;
        if (cardId && typeof tarotCards !== 'undefined') {
            currentDailyEntry.tarotCard = tarotCards[cardId];
            updateDailyTarotCardDisplay();
        } else {
            currentDailyEntry.tarotCard = null;
            document.getElementById('selected-daily-tarot-card').innerHTML = '';
        }
    });
    
    // Botones del formulario diario
    document.getElementById('save-daily-btn').addEventListener('click', saveDailyEntry);
    document.getElementById('clear-daily-btn').addEventListener('click', clearDailyForm);
    document.getElementById('close-daily-btn').addEventListener('click', function() {
        document.getElementById('daily-card-form').classList.remove('show');
        removeFormOverlay();
    });
    
    // Aplicar overlay cuando se abre el formulario
    applyFormOverlay('daily-card-form');
    
    console.log('✅ Formulario diario inicializado correctamente');
}

// ===== FUNCIONES PARA FORMULARIO DIARIO =====
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
    document.getElementById('selected-daily-tarot-card').innerHTML = '';
    document.getElementById('daily-deck-select').value = currentDailyEntry.deckId;
    
    console.log('🗑️ Formulario diario limpiado');
}

function updateDailyTarotCardDisplay() {
    const displayElement = document.getElementById('selected-daily-tarot-card');
    
    if (currentDailyEntry.tarotCard) {
        const card = currentDailyEntry.tarotCard;
        const orientation = currentDailyEntry.tarotOrientation;
        const orientationText = orientation === 'upright' ? 'Derecha' : 'Reversa';
        
        displayElement.innerHTML = `
            <div class="selected-tarot-card">
                <div class="tarot-card-display">
                    <div class="tarot-card-name">${card.Name}</div>

                    <div class="tarot-card-details">
                        <div class="tarot-card-detail">${card.Suit}</div>
                        <div class="tarot-card-detail">${orientationText}</div>
                        ${card.Element ? `<div class="tarot-card-detail">${card.Element}</div>` : ''}
                        ${card.Planet ? `<div class="tarot-card-detail">${card.Planet}</div>` : ''}
                        ${card.Sign ? `<div class="tarot-card-detail">${card.Sign}</div>` : ''}
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

        alert('Carta del día guardada correctamente');
        document.getElementById('daily-card-form').classList.remove('show');
        removeFormOverlay();

    } catch (error) {
        console.error('Error al guardar carta del día:', error);
        alert('Error al guardar: ' + error.message);
    }
}

// ===== FUNCIONES DE OVERLAY PARA FORMULARIOS =====
function applyFormOverlay(formId) {
    // Crear overlay si no existe
    let overlay = document.getElementById('form-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'form-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        // Cerrar formulario al hacer clic en el overlay
        overlay.addEventListener('click', function() {
            document.getElementById(formId).classList.remove('show');
            removeFormOverlay();
        });
        
        // Animar la aparición del overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
    
    // Asegurar que el formulario esté por encima del overlay
    const form = document.getElementById(formId);
    if (form) {
        form.style.zIndex = '999';
    }
}

function removeFormOverlay() {
    const overlay = document.getElementById('form-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
    }
}

// ===== MODIFICAR EL setupFooterMenu PARA INCLUIR OVERLAY =====
function setupFooterMenu() {
    const burgerBtn = document.getElementById('burger-menu-btn');
    const menuOptions = document.getElementById('footer-menu-options');
    const newDailyCard = document.getElementById('new-daily-card');
    const newSpread = document.getElementById('new-spread');
    const manageDecks = document.getElementById('manage-decks');
    const manageSpreads = document.getElementById('manage-spreads');
    
    const dailyForm = document.getElementById('daily-card-form');
    const spreadForm = document.getElementById('spread-form');
    
    // Alternar menú al hacer clic en el botón hamburguesa
    if (burgerBtn) {
        burgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            menuOptions.classList.toggle('show');
            // Cerrar formularios si están abiertos
            dailyForm.classList.remove('show');
            spreadForm.classList.remove('show');
            removeFormOverlay();
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
            // Mostrar formulario para carta del día
            dailyForm.classList.add('show');
            spreadForm.classList.remove('show');
            menuOptions.classList.remove('show');
            initializeDailyForm();
        });
    }
            
    if (newSpread) {
        newSpread.addEventListener('click', function() {
            // Mostrar formulario para tirada
            spreadForm.classList.add('show');
            dailyForm.classList.remove('show');
            menuOptions.classList.remove('show');
            initializeSpreadForm();
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
            showManageSpreadsModal();
            menuOptions.classList.remove('show');
        });
    }
    
    // Cerrar formularios - Asegurar que los event listeners estén configurados
    const closeDailyBtn = document.getElementById('close-daily-btn');
    const closeSpreadBtn = document.getElementById('close-spread-btn');
    
    if (closeDailyBtn) {
        // Remover event listener existente para evitar duplicados
        closeDailyBtn.replaceWith(closeDailyBtn.cloneNode(true));
        // Agregar nuevo event listener
        document.getElementById('close-daily-btn').addEventListener('click', function() {
            console.log('❌ Cerrando formulario diario...');
            dailyForm.classList.remove('show');
            removeFormOverlay();
        });
    }
    
    if (closeSpreadBtn) {
        // Remover event listener existente para evitar duplicados
        closeSpreadBtn.replaceWith(closeSpreadBtn.cloneNode(true));
        // Agregar nuevo event listener
        document.getElementById('close-spread-btn').addEventListener('click', function() {
            console.log('❌ Cerrando formulario de tirada...');
            spreadForm.classList.remove('show');
            removeFormOverlay();
        });
    }
    
    // Cerrar formularios al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!dailyForm.contains(e.target) && !burgerBtn.contains(e.target) && !menuOptions.contains(e.target)) {
            dailyForm.classList.remove('show');
            removeFormOverlay();
        }
        if (!spreadForm.contains(e.target) && !burgerBtn.contains(e.target) && !menuOptions.contains(e.target)) {
            spreadForm.classList.remove('show');
            removeFormOverlay();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingLogo = document.getElementById('loading-logo');
    let pulseCount = 0;
    
    function pulseAnimation() {
        if (pulseCount < 2) {
            // Aumentar
            loadingLogo.style.transform = 'scale(1.3)';
            setTimeout(() => {
                // Disminuir
                loadingLogo.style.transform = 'scale(1)';
                pulseCount++;
                setTimeout(pulseAnimation, 500);
            }, 200);
        } else {
            // Ir a la página después de las pulsaciones
            setTimeout(() => {
                loadingScreen.style.transition = 'opacity 0.3s ease';
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 200);
            }, 200);
        }
    }
    
    // Iniciar la animación
    setTimeout(pulseAnimation, 20);
});