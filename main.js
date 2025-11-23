// ===== FUNCIONES DE CARTA DEL DÍA =====
async function checkTodayCard() {
    try {
        const today = new Date();
        
        // Ajustar para zona horaria de Argentina (UTC-3)
        const offset = -3 * 60; // Argentina UTC-3 en minutos
        const localTime = new Date(today.getTime() + (offset - today.getTimezoneOffset()) * 60000);
        
        const todayStr = localTime.toISOString().split('T')[0];
        
        const { data, error } = await supabase
            .from('log_entries')
            .select('*')
            .eq('entry_type', 'daily')
            .gte('date', todayStr + 'T00:00:00')
            .lte('date', todayStr + 'T23:59:59');
            
        if (error) throw error;
        
        if (data && data.length > 0) {
            todayCard = data[0];
            displayTodayCard();
        } else {
            displayNoCardToday();
        }
    } catch (error) {
        console.error('Error al verificar carta del día:', error);
        displayNoCardToday();
    }
}

function displayTodayCard() {
    const container = document.getElementById('daily-card-status');
    
    if (todayCard && todayCard.tarot_card) {
        const card = todayCard.tarot_card;
        const orientation = todayCard.tarot_orientation === 'reversed' ? 'Reversa' : 'Derecha';
        const orientationSymbol = todayCard.tarot_orientation === 'reversed' ? 'R' : 'D';
        
        let signArcanaHTML = '';
        let planetArcanaHTML = '';
        let arcanaCount = 0;
        
        if (card.Sign) {
            const signInSpanish = translateSignToSpanish(card.Sign);
            const majorArcanaSign = getMajorArcanaForSign(card.Sign);
            const signSymbol = getZodiacSymbol(card.Sign);
            signArcanaHTML = `
            <div class="astrology-display">    
            <div class="arcana-item">
                    <div class="arcana-content">
                        <div class="astro-body">${signSymbol}</div>
                        <div class="astro-name">${signInSpanish}</div>
                        <div class="body-name">${majorArcanaSign}</div>
                    </div>
                </div>
            `;
            arcanaCount++;
        }

        if (card.Planet) {
            const planetInSpanish = translatePlanetToSpanish(card.Planet);
            const majorArcanaPlanet = getMajorArcanaForPlanet(card.Planet);
            const planetSymbol = getPlanetSymbol(card.Planet);
            planetArcanaHTML = `
                <div class="arcana-item">
                    <div class="arcana-content">
                        <div class="astro-body" style="text-align: right;">${planetSymbol}</div>
                        <div class="astro-name" style="text-align: right;">${planetInSpanish}</div>
                        <div class="body-name" style="text-align: right;">${majorArcanaPlanet}</div>
                    </div>
                </div></div>
            `;
            arcanaCount++;
        }

        const now = new Date();
        const hours = now.getHours();
        let greeting = "Buenos dias Mica.<br> Que lindo verte por acá";
        
        if (hours >= 12 && hours < 21) {
            greeting = "Buenas tardes Mica!<br> Como va el día?";
        } else if (hours >= 21 || hours < 6) {
            greeting = "Hermosa Noche Mica!";
        }
        
        // Determine grid class based on number of items
        const gridClass = arcanaCount === 1 ? 'arcana-grid single-item' : 'arcana-grid';
        
        container.innerHTML = `
            <div class="greeting-header">
                ${greeting}
            </div>
            
            <div class="mono-text-upper">bienvenida a tu reporte arcánico</div>
            
            <div class="today-card-display">
                <h3>${card.Name} <span class="orientation-symbol ${orientationSymbol === 'R' ? 'reverse' : 'direct'}">${orientationSymbol}</span></h3>
            </div>
            
            <div class="${gridClass}">
                ${signArcanaHTML}
                ${planetArcanaHTML}
            </div>
        `;
    } else {
        displayNoCardToday();
    }
}

function displayNoCardToday() {
    const container = document.getElementById('daily-card-status');
    const now = new Date();
    const hours = now.getHours();
    let greeting = "Buenos dias Mica.<br> Que lindo verte por acá";
    
    if (hours >= 12 && hours < 18) {
        greeting = "Buenas tardes Mica!<br> Como va el día?";
    } else if (hours >= 18 || hours < 6) {
        greeting = "Hermosa Noche Mica!";
    }
    
    container.innerHTML = `
        <div class="no-card-container">
            <div class="greeting-header">
                ${greeting}
            </div>
            <div class="today-headline">bienvenida a tu reporte arcánico</div>
            <div class="today-p">Aún no has sacado tu carta del día</div>
            <button class="btn-primary" id="draw-today-card">Sacar Carta del Día</button>
        </div>
    `;
    
    document.getElementById('draw-today-card').addEventListener('click', function() {
        // Abrir el modal de carta del día
        document.getElementById('daily-card-form').classList.add('show');
        initializeDailyForm();
        applyFormOverlay('daily-card-form');
    });
}
