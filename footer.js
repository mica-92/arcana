// ===== CONFIGURACIÓN DEL FOOTER MENU ACTUALIZADO =====
function setupFooterMenu() {
    const burgerBtn = document.getElementById('burger-menu-btn');
    const menuOptions = document.getElementById('footer-menu-options');
    const newDailyCard = document.getElementById('new-daily-card');
    const newSpread = document.getElementById('new-spread');
    const manageDecks = document.getElementById('manage-decks');
    const manageSpreads = document.getElementById('manage-spreads');
    
    console.log('🔧 Configurando footer menu...');
    
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
            console.log('🐕 Clic en Carta del Día');
            // Mostrar modal para carta del día
            if (typeof showDailyCardModal === 'function') {
                showDailyCardModal();
            } else {
                console.error('showDailyCardModal no está disponible');
                alert('Función no disponible. Recarga la página.');
            }
            menuOptions.classList.remove('show');
        });
    }
            
if (newSpread) {
    newSpread.addEventListener('click', function() {
        console.log('🐈 Clic en Otras Tiradas - Footer Menu');
        
        // DEBUG: Verificar qué funciones están disponibles
        console.log('🔍 Funciones disponibles:');
        console.log('- showSpreadModal:', typeof showSpreadModal);
        
        if (typeof showSpreadModal === 'function') {
            console.log('✅ Abriendo modal de tiradas desde footer');
            showSpreadModal();
        } else {
            console.error('❌ showSpreadModal no disponible, usando fallback');
            // Fallback al formulario existente
            const spreadForm = document.getElementById('spread-form');
            if (spreadForm) {
                console.log('🔄 Usando formulario existente');
                spreadForm.classList.add('show');
                if (typeof initializeSpreadForm === 'function') {
                    initializeSpreadForm();
                }
            } else {
                alert('La función de tiradas no está disponible.');
            }
        }
        menuOptions.classList.remove('show');
    });
}
    
    if (manageDecks) {
        manageDecks.addEventListener('click', function() {
            console.log('⚙️ Clic en Administrar Mazos');
            // Mostrar modal de gestión de mazos
            if (typeof showManageDecksModal === 'function') {
                showManageDecksModal();
            } else {
                alert('Gestión de mazos en desarrollo');
            }
            menuOptions.classList.remove('show');
        });
    }
    
    if (manageSpreads) {
        manageSpreads.addEventListener('click', function() {
            console.log('⚙️ Clic en Administrar Tiradas');
            // Mostrar modal de gestión de tiradas
            if (typeof showManageSpreadsModal === 'function') {
                showManageSpreadsModal();
            } else {
                alert('Gestión de tiradas en desarrollo');
            }
            menuOptions.classList.remove('show');
        });
    }

    // Cerrar formularios footer (mantener por compatibilidad)
    const closeDailyBtn = document.getElementById('close-daily-btn');
    const closeSpreadBtn = document.getElementById('close-spread-btn');
    const dailyForm = document.getElementById('daily-card-form');
    const spreadForm = document.getElementById('spread-form');
    
    if (closeDailyBtn && dailyForm) {
        closeDailyBtn.addEventListener('click', function() {
            dailyForm.classList.remove('show');
        });
    }
    
    if (closeSpreadBtn && spreadForm) {
        closeSpreadBtn.addEventListener('click', function() {
            spreadForm.classList.remove('show');
        });
    }
    
    // Cerrar formularios al hacer clic fuera (mantener por compatibilidad)
    document.addEventListener('click', function(e) {
        if (dailyForm && !dailyForm.contains(e.target) && burgerBtn && !burgerBtn.contains(e.target)) {
            dailyForm.classList.remove('show');
        }
        if (spreadForm && !spreadForm.contains(e.target) && burgerBtn && !burgerBtn.contains(e.target)) {
            spreadForm.classList.remove('show');
        }
    });
    
    console.log('✅ Footer menu configurado');
}

// Debug al cargar
console.log('📁 footer.js cargado');