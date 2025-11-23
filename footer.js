// ===== CONFIGURACIÓN DEL FOOTER MENU ACTUALIZADO =====
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
    
    // Cerrar formularios
    document.getElementById('close-daily-btn').addEventListener('click', function() {
        dailyForm.classList.remove('show');
    });
    
    document.getElementById('close-spread-btn').addEventListener('click', function() {
        spreadForm.classList.remove('show');
    });
    
    // Cerrar formularios al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!dailyForm.contains(e.target) && !burgerBtn.contains(e.target)) {
            dailyForm.classList.remove('show');
        }
        if (!spreadForm.contains(e.target) && !burgerBtn.contains(e.target)) {
            spreadForm.classList.remove('show');
        }
    });
}