// ===== CONFIGURACIÓN DEL FOOTER SIMPLIFICADO =====
function setupFooterMenu() {
    console.log('🔧 Configurando footer simplificado...');
    
    // Solo mantener el crédito, eliminar funcionalidad del menú burger
    const burgerBtn = document.getElementById('burger-menu-btn');
    const menuOptions = document.getElementById('footer-menu-options');
    
    // Ocultar/eliminar el menú burger
    if (burgerBtn) {
        burgerBtn.style.display = 'none';
    }
    if (menuOptions) {
        menuOptions.style.display = 'none';
    }
    
    console.log('✅ Footer simplificado configurado');
}

// Debug al cargar
console.log('📁 footer.js cargado - versión simplificada');