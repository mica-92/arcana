// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    setupFooterMenu();

    // === AGREGAR ESTOS EVENT LISTENERS EN EL SCRIPT PRINCIPAL ===
    setTimeout(() => {
        const periodSelectorClose = document.getElementById('period-selector-close');
        if (periodSelectorClose) {
            periodSelectorClose.addEventListener('click', hidePeriodSelector);
        }
        
        const periodSelectorCancel = document.getElementById('period-selector-cancel');
        if (periodSelectorCancel) {
            periodSelectorCancel.addEventListener('click', hidePeriodSelector);
        }
        
        const periodSelectorApply = document.getElementById('period-selector-apply');
        if (periodSelectorApply) {
            periodSelectorApply.addEventListener('click', applyCustomPeriod);
        }
        
        const customPeriodType = document.getElementById('custom-period-type');
        if (customPeriodType) {
            customPeriodType.addEventListener('change', function() {
                updateCustomPeriodOptions();
            });
        }
        
        const customYear = document.getElementById('custom-year');
        if (customYear) {
            customYear.addEventListener('change', function() {
                if (document.getElementById('custom-period-type').value === 'week') {
                    updateWeekOptions();
                }
            });
        }
    }, 100);

    loadDecks().then(() => {
        return loadSpreadTypes();
    }).then(() => {
        return loadLogHistory();
    }).then(() => {
        initializeStatistics();
    });

    checkTodayCard();
    loadAstrologyData();
});