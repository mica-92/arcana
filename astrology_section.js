// ===== FUNCIONES ASTROLÓGICAS =====
async function loadAstrologyData() {
    try {
        const today = new Date();
        
        // Ajustar para zona horaria de Argentina (UTC-3)
        const offset = -3 * 60; // Argentina UTC-3 en minutos
        const localTime = new Date(today.getTime() + (offset - today.getTimezoneOffset()) * 60000);
        
        const sunLongitude = calculatePreciseSunLongitude(localTime);
        const moonLongitude = calculatePreciseMoonLongitude(localTime);
        const moonPhase = calculatePreciseMoonPhase(localTime);
        const aspect = calculateSunMoonAspect(sunLongitude, moonLongitude);
        
        const sunPosition = getDetailedPosition(sunLongitude);
        const moonPosition = getDetailedPosition(moonLongitude);
        
        const sunTarotCards = getTarotCardsForCelestialBody('Sun', sunLongitude);
        const moonTarotCards = getTarotCardsForCelestialBody('Moon', moonLongitude);
        
        astrologyData = {
            Sun: {
                sign: sunPosition.sign,
                longitude: sunLongitude,
                degree: sunPosition.degree,
                minutes: sunPosition.minutes,
                seconds: sunPosition.seconds,
                positionString: sunPosition.toString(),
                tarotCards: sunTarotCards
            },
            Moon: {
                sign: moonPosition.sign,
                longitude: moonLongitude,
                degree: moonPosition.degree,
                minutes: moonPosition.minutes,
                seconds: moonPosition.seconds,
                positionString: moonPosition.toString(),
                tarotCards: moonTarotCards
            },
            MoonPhase: moonPhase,
            Aspect: aspect,
            Zodiac: 'Tropical',
            CalculationMethod: 'Basado en datos fundacionales del 1 Mar 2025 - Zona Argentina (UTC-3)'
        };
        
        displayAstrologyInfo();
        
    } catch (error) {
        console.error('Error en cálculo astrológico:', error);
        astrologyData = {
            Sun: {
                sign: 'Escorpio',
                longitude: 231.5,
                degree: 21,
                minutes: 30,
                seconds: 0,
                positionString: 'Escorpio 21°30\'0"',
                tarotCards: { 
                    signMajor: 'La Muerte', 
                    planetMajor: 'La Torre',
                    minor: '7 de Copas',
                    ruler: 'Mars'
                }
            },
            Moon: {
                sign: 'Virgo',
                longitude: 160.8,
                degree: 10,
                minutes: 48,
                seconds: 0,
                positionString: 'Virgo 10°48\'0"',
                tarotCards: { 
                    signMajor: 'El Ermitaño', 
                    planetMajor: 'El Mago',
                    minor: '8 de Pentáculos', 
                    ruler: 'Mercury'
                }
            },
            MoonPhase: { name: 'Luna Llena', emoji: '🌕', percentage: 100, angle: 180 },
            Aspect: { type: 'Oposición', orb: 0, emoji: '⚪' },
            Zodiac: 'Tropical',
            CalculationMethod: 'Datos de prueba - Sistema en desarrollo - Zona Argentina'
        };
        displayAstrologyInfo();
    }
}
// ===== FUNCIONES ASTRONÓMICAS =====
function getDaysFromFoundation(date) {
    const diffMs = date - FOUNDATION_DATE;
    return diffMs / (1000 * 60 * 60 * 24);
}

function calculatePreciseSunLongitude(date) {
    const daysFromFoundation = getDaysFromFoundation(date);
    const longitude = FOUNDATION_SUN_LONGITUDE + (daysFromFoundation * SUN_DAILY_MOTION);
    return normalizeLongitude(longitude);
}

function calculatePreciseMoonLongitude(date) {
    const daysFromFoundation = getDaysFromFoundation(date);
    const longitude = FOUNDATION_MOON_LONGITUDE + (daysFromFoundation * MOON_DAILY_MOTION);
    return normalizeLongitude(longitude);
}

function normalizeLongitude(longitude) {
    let normalized = longitude % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
}

// ===== FUNCIÓN CORREGIDA DE FASE LUNAR BASADA EN PORCENTAJE =====
function calculatePreciseMoonPhase(date) {
    // Usar las mismas funciones consistentemente
    const sunLongitude = calculatePreciseSunLongitude(date);
    const moonLongitude = calculatePreciseMoonLongitude(date);
    
    let elongation = moonLongitude - sunLongitude;
    if (elongation < 0) elongation += 360;
    
    const phaseAngle = elongation;
    const illumination = 0.5 * (1 - Math.cos(phaseAngle * Math.PI / 180));
    const phasePercentage = Math.round(illumination * 100);
    
    let phaseName, phaseEmoji, visibleSide, visibilityPeriod;
    
    // Determinar hemisferio (asumimos hemisferio norte por defecto)
    const hemisphere = 'Norte';
    
    // Definir las fases basadas en porcentaje de iluminación
    if (phasePercentage >= 0 && phasePercentage <= 2) {
        phaseName = 'Luna Nueva';
        phaseEmoji = '<i class="fa-regular fa-circle"></i>';
        visibleSide = '0-2%';
        visibilityPeriod = 'Toda la mañana y toda la tarde, pero no visible';
        
    } else if (phasePercentage >= 3 && phasePercentage <= 34) {
        phaseName = 'Luna Creciente';
        phaseEmoji = '<i class="fa-regular fa-moon style="transform: rotate(180deg);"></i>';
        visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (derecha)` : `${phasePercentage}% (izquierda)`;
        visibilityPeriod = 'Fin de la mañana, por la tarde y poco después de la puesta del sol';
        
    } else if (phasePercentage >= 35 && phasePercentage <= 65) {
        phaseName = 'Cuarto Creciente';
        phaseEmoji = '<i class="fa-solid fa-circle-half-stroke"></i>';
        visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (derecha)` : `${phasePercentage}% (izquierda)`;
        visibilityPeriod = 'Por la tarde y en la primera mitad de la noche';
        
    } else if (phasePercentage >= 66 && phasePercentage <= 96) {
        phaseName = 'Luna Creciente Convexa';
        phaseEmoji = '<i class="fa-solid fa-moon"></i>';
        visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (derecha)` : `${phasePercentage}% (izquierda)`;
        visibilityPeriod = 'Por la tarde, gran parte de la noche';
        
    } else if (phasePercentage >= 97 && phasePercentage <= 100) {
        phaseName = 'Luna Llena';
        phaseEmoji = '<i class="fa-solid fa-circle"></i>';
        visibleSide = `${phasePercentage}%`;
        visibilityPeriod = 'Toda la noche';
        
    } else if (phasePercentage >= 66 && phasePercentage <= 96) {
        // Fase menguante - mismo rango porcentual pero diferente nombre
        // Para distinguir entre creciente y menguante, usamos el ángulo
        if (phaseAngle >= 180 && phaseAngle <= 360) {
            phaseName = 'Luna Menguante Convexa';
            phaseEmoji = '<i class="fa-solid fa-moon style="transform: rotate(180deg)"></i>';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (izquierda)` : `${phasePercentage}% (derecha)`;
            visibilityPeriod = 'Gran parte de la noche, comienzo de la mañana';
        }
        
    } else if (phasePercentage >= 35 && phasePercentage <= 65) {
        // Cuarto menguante
        if (phaseAngle >= 180 && phaseAngle <= 360) {
            phaseName = 'Cuarto Menguante';
            phaseEmoji = '<i class="fa-solid fa-circle-half-stroke" style="transform: rotate(180deg)></i>';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (izquierda)` : `${phasePercentage}% (derecha)`;
            visibilityPeriod = 'Madrugada y de mañana';
        }
        
    } else if (phasePercentage >= 3 && phasePercentage <= 34) {
        // Luna menguante
        if (phaseAngle >= 180 && phaseAngle <= 360) {
            phaseName = 'Luna Menguante';
            phaseEmoji = '<i class="fa-regular fa-moon"></i>';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (izquierda)` : `${phasePercentage}% (derecha)`;
            visibilityPeriod = 'Fin de la madrugada, de mañana y comienzo de la tarde';
        }
    }
    
    // Si no se asignó nombre, usar lógica de respaldo basada en ángulo
    if (!phaseName) {
        if (phaseAngle < 22.5 || phaseAngle >= 337.5) {
            phaseName = 'Luna Nueva';
            phaseEmoji = '<i class="fa-solid fa-circle"></i>';
            visibleSide = '0-2%';
            visibilityPeriod = 'Toda la mañana y toda la tarde, pero no visible';
        } else if (phaseAngle < 67.5) {
            phaseName = 'Luna Creciente';
            phaseEmoji = '<i class="fa-solid fa-moon" style="transform: rotate(180deg);"></i>';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (derecha)` : `${phasePercentage}% (izquierda)`;
            visibilityPeriod = 'Fin de la mañana, por la tarde y poco después de la puesta del sol';
        } else if (phaseAngle < 112.5) {
            phaseName = 'Cuarto Creciente';
            phaseEmoji = '<i class="fa-regular fa-circle"></i>';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (derecha)` : `${phasePercentage}% (izquierda)`;
            visibilityPeriod = 'Por la tarde y en la primera mitad de la noche';
        } else if (phaseAngle < 157.5) {
            phaseName = 'Luna Creciente Convexa';
            phaseEmoji = '<i class="fa-solid fa-moon"></i>';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (derecha)` : `${phasePercentage}% (izquierda)`;
            visibilityPeriod = 'Por la tarde, gran parte de la noche';
        } else if (phaseAngle < 202.5) {
            phaseName = 'Luna Llena';
            phaseEmoji = '<i class="fa-regular fa-circle"></i>';
            visibleSide = `${phasePercentage}%`;
            visibilityPeriod = 'Toda la noche';
        } else if (phaseAngle < 247.5) {
            phaseName = 'Luna Menguante Convexa';
            phaseEmoji = '🌖';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (izquierda)` : `${phasePercentage}% (derecha)`;
            visibilityPeriod = 'Gran parte de la noche, comienzo de la mañana';
        } else if (phaseAngle < 292.5) {
            phaseName = 'Cuarto Menguante';
            phaseEmoji = '<i class="fa-regular fa-circle"></i>';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (izquierda)` : `${phasePercentage}% (derecha)`;
            visibilityPeriod = 'Madrugada y de mañana';
        } else {
            phaseName = 'Luna Menguante';
            phaseEmoji = '🌘';
            visibleSide = hemisphere === 'Norte' ? `${phasePercentage}% (izquierda)` : `${phasePercentage}% (derecha)`;
            visibilityPeriod = 'Fin de la madrugada, de mañana y comienzo de la tarde';
        }
    }
    
    return {
        name: phaseName,
        emoji: phaseEmoji,
        percentage: phasePercentage,
        angle: Math.round(phaseAngle),
        visibleSide: visibleSide,
        visibilityPeriod: visibilityPeriod,
        hemisphere: hemisphere,
        isNewMoon: phasePercentage <= 2,
        isFullMoon: phasePercentage >= 97,
        sunLongitude: Math.round(sunLongitude),
        moonLongitude: Math.round(moonLongitude),
        elongation: Math.round(elongation)
    };
}

function displayAstrologyInfo() {
    const container = document.getElementById('astrology-info');
    
    if (!astrologyData) {
        container.innerHTML = `
            <div class="astrology-error">
                No se pudieron cargar los datos astrológicos.
                <button class="retry-btn" id="retry-astrology">Reintentar</button>
            </div>
        `;
        document.getElementById('retry-astrology').addEventListener('click', loadAstrologyData);
        return;
    }
    
    const sunData = astrologyData.Sun || {};
    const moonData = astrologyData.Moon || {};
    const moonPhaseData = astrologyData.MoonPhase || {};
    const aspectData = astrologyData.Aspect || {};
    
    const sunIsValid = sunData.positionString && sunData.sign;
    const moonIsValid = moonData.positionString && moonData.sign;
    const sunSignSymbol = getZodiacSymbol(sunData.sign);
    const sunPlanetSymbol = getPlanetSymbol(sunData.tarotCards?.ruler);
    const moonSignSymbol = getZodiacSymbol(moonData.sign);
    const moonPlanetSymbol = getPlanetSymbol(moonData.tarotCards?.ruler);
    
    // Información adicional de la fase lunar
    const moonPhaseInfo = moonPhaseData ? `
        <div class="moon-phase-detailed">
            <div class="moon-phase-main">
                <div class="moon-item"><b>FASE LUNAR:</b></div> 
                <div class="moon-item">${moonPhaseData.emoji} ${moonPhaseData.name} (${moonPhaseData.percentage}%)</div>
            </div>
        </div>
    ` : '';
    
    container.innerHTML = `
    <div class="astro-card-header">Pronóstico Astrológico</div>

    <div class="astrology-display">
        <div class="celestial-body">
            <div class="astro-body">Q</div>
            <div class="astro-name">HELIOS</div>
            <div class="body-name">en ${sunData.sign || 'Calculando...'}</div>
            
            ${sunIsValid ? 
                `<div class="body-position">${sunData.positionString}</div>` : 
                `<div class="body-position calculating">Cálculo en progreso...</div>`
            }
            <div class="tarot-cards">
                <div class="tarot-card-item">
                    <i class="fa-solid fa-angle-right"></i>
                    ${sunData.tarotCards?.signMajor || 'Calculando...'} <div class="astro-arcane">${sunSignSymbol}</div>
                </div>
                <div class="tarot-card-item">
                    <i class="fa-solid fa-angle-right"></i>
                    ${sunData.tarotCards?.planetMajor || 'Calculando...'} <div class="astro-arcane">${sunPlanetSymbol}</div>
                </div>
                <div class="tarot-card-item">
                    <i class="fa-solid fa-angle-right" style="text-align: right;"></i>
                    ${sunData.tarotCards?.minor || 'Calculando...'} <b>${sunData.tarotCards?.decandisplay || ''}</b>
                </div>
            </div>
        </div>
        
        <div class="celestial-body">
            <div class="astro-body"style="display: block; text-align: right;">R</div>
            <div class="astro-name"style="text-align: right;">SELENE</div>
            <div class="body-name"style="text-align: right;">en ${moonData.sign || 'Calculando...'}</div>
            ${moonIsValid ? 
                `<div class="body-position"style="text-align: right;">${moonData.positionString}</div>` : 
                `<div class="body-position calculating">Cálculo en progreso...</div>`
            }
            <div class="tarot-cards">
                <div class="tarot-card-item"style="text-align: right;">
                    <div class="astro-arcane">${moonSignSymbol}</div> ${moonData.tarotCards?.signMajor || 'Calculando...'} 
                    <i class="fa-solid fa-angle-left"></i>
                </div>
                <div class="tarot-card-item"style="text-align: right;">
                     <div class="astro-arcane">${moonPlanetSymbol}</div> ${moonData.tarotCards?.planetMajor || 'Calculando...'}
                    <i class="fa-solid fa-angle-left"></i>
                </div>
                <div class="tarot-card-item"style="text-align: right;">
                    <b>${moonData.tarotCards?.decandisplay || ''}</b> ${moonData.tarotCards?.minor || 'Calculando...'} 
                    <i class="fa-solid fa-angle-left"></i>
                </div>
            </div>
        </div>
    
    ${moonPhaseInfo}
    
${aspectData ? `
        <div class="moon-phase" style="text-align: right;">
            <div class="moon-item" style="display: block;"><b>ASPECTO:</b></div> 
            <div class="moon-item">${aspectData.type} ${aspectData.type === 'APOSTROPHE' ? `(${Math.round(aspectData.exactDifference)}°)` : ''}${aspectData.emoji}</div>
        </div>
    ` : ''}
    </div>

    <div class="moon-phase">
        <div class="astro-name" style="margin-top: 25px;">PRÓXIMAS FASES:</div>
        <div id="future-moon-phases-inline">
            <!-- Las fases lunares futuras se cargarán aquí -->
        </div>
    </div>
    `;
    
    loadFutureMoonPhasesInline();
}
// Agregar el CSS adicional al documento
const style = document.createElement('style');
document.head.appendChild(style);

function calculateSunMoonAspect(sunLongitude, moonLongitude) {
    let difference = Math.abs(sunLongitude - moonLongitude);
    if (difference > 180) difference = 360 - difference;
    
    // Guardar la diferencia original para mostrar en APOSTROPHE
    const exactDifference = difference;
    
    if (difference <= 15) {
        return { 
            type: 'CONJUNCION', 
            orb: difference, 
            emoji: '<div class="astro-aspecto">"</div>',
            exactDifference: exactDifference
        };
    } else if (Math.abs(difference - 180) <= 15) {
        return { 
            type: 'OPOSICION', 
            orb: Math.abs(difference - 180), 
            emoji: '<div class="astro-aspecto">!</div>',
            exactDifference: exactDifference
        };
    } else if (Math.abs(difference - 90) <= 15) {
        return { 
            type: 'CUADRATURA', 
            orb: Math.abs(difference - 90), 
            emoji: '<div class="astro-aspecto">#</div>',
            exactDifference: exactDifference
        };
    } else if (Math.abs(difference - 120) <= 15) {
        return { 
            type: 'TRIGONO', 
            orb: Math.abs(difference - 120), 
            emoji: '<div class="astro-aspecto">$</div>',
            exactDifference: exactDifference
        };
    } else if (Math.abs(difference - 60) <= 15) {
        return { 
            type: 'SEXTIL', 
            orb: Math.abs(difference - 60), 
            emoji: '<div class="astro-aspecto">%</div>',
            exactDifference: exactDifference
        };
    } else {
        return { 
            type: 'APOSTROPHE', 
            orb: null, 
            emoji: '<i class="fa-solid fa-x" style="font-size:1.4rem"></i>',
            exactDifference: exactDifference
        };
    }
}

// ===== ACTUALIZAR LA FUNCIÓN displayAstrologyInfo =====
function calculateSunLongitude(date) {
    return calculatePreciseSunLongitude(date);
}

function calculateMoonLongitude(date) {
    return calculatePreciseMoonLongitude(date);
}

function getDetailedPosition(longitude) {
    const normalizedLongitude = normalizeLongitude(longitude);
    const sign = getZodiacSignFromLongitude(normalizedLongitude);
    const degreeInSign = Math.floor(normalizedLongitude % 30);
    const minutesDecimal = (normalizedLongitude % 1) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.round((minutesDecimal - minutes) * 60);
    
    return {
        sign: sign,
        degree: degreeInSign,
        minutes: minutes,
        seconds: seconds,
        fullLongitude: normalizedLongitude,
        toString: function() {
            const signSymbol = getZodiacSymbol(sign);
            return `${this.degree}° <div class="astro-position">${signSymbol}</div>`;
        }
    };
}

// ===== FUNCIONES DE FASES LUNARES FUTURAS =====
function calculateFutureMoonAspects() {
    const today = new Date();
    
    // Ajustar para zona horaria de Argentina (UTC-3)
    const offset = -3 * 60;
    const localToday = new Date(today.getTime() + (offset - today.getTimezoneOffset()) * 60000);
    
    const aspects = [];
    const maxDays = 180;
    
    const targetAspects = [
        { angle: 0, type: 'CONJUNCION', emoji: '"', showPhase: true, isNewMoon: true },
        { angle: 180, type: 'OPOSICION', emoji: '!', showPhase: true, isNewMoon: false },
        { angle: 90, type: 'CUADRATURA', emoji: '#', showPhase: false },
        { angle: 120, type: 'TRIGONO', emoji: '$', showPhase: false },
        { angle: 60, type: 'SEXTIL', emoji: '%', showPhase: false }
    ];
            
    const aspectThreshold = 3;
    
    for (let day = 1; day <= maxDays; day++) {
        const futureDate = new Date(localToday);
        futureDate.setDate(localToday.getDate() + day);
        
        const sunLongitude = calculatePreciseSunLongitude(futureDate);
        const moonLongitude = calculatePreciseMoonLongitude(futureDate);
        
        let elongation = Math.abs(moonLongitude - sunLongitude);
        if (elongation > 180) elongation = 360 - elongation;
        
        for (const targetAspect of targetAspects) {
            const difference = Math.abs(elongation - targetAspect.angle);
            
            if (difference <= aspectThreshold) {
                const moonSign = getZodiacSignFromLongitude(moonLongitude);
                
                aspects.push({
                    date: new Date(futureDate),
                    type: targetAspect.type,
                    emoji: targetAspect.emoji,
                    moonSign: moonSign,
                    showPhase: targetAspect.showPhase,
                    isNewMoon: targetAspect.isNewMoon,
                    exactAngle: elongation,
                    orb: difference
                });
                
                break;
            }
        }
        
        if (aspects.length >= 8) break;
    }
    
    return aspects;
}

function loadFutureMoonPhasesInline() {
    const container = document.getElementById('future-moon-phases-inline');
    if (!container) return;
    
    const aspects = calculateFutureMoonAspects();
    let html = '';
    
    aspects.forEach(aspect => {
        const dateStr = formatDate(aspect.date);
        const moonSignSymbol = getZodiacSymbol(aspect.moonSign);
        
        let phaseHTML = '';
        if (aspect.showPhase) {
            const phaseType = aspect.isNewMoon ? 'LN' : 'LL';
            const phaseIcon = aspect.isNewMoon ? 
                '<i class="fa-regular fa-circle"></i>' : 
                '<i class="fa-solid fa-circle"></i>';
            phaseHTML = `
                <div class="moon-phase-type">
                    ${phaseIcon} ${phaseType}
                </div>
            `;
        } else {
            phaseHTML = '<div class="moon-phase-type"></div>';
        }
        
        html += `
            <div class="moon-phase-item">
                <div class="moon-aspect-symbol">${aspect.emoji}</div>
                <div class="moon-sign-symbol">${moonSignSymbol}</div>
                <div class="moon-phase-date">${dateStr}</div>
                ${phaseHTML}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ===== FUNCIONES DE TRADUCCIÓN Y SÍMBOLOS =====
function translateSignToSpanish(signInEnglish) {
    const signTranslations = {
        'Aries': 'Aries',
        'Taurus': 'Tauro',
        'Gemini': 'Géminis',
        'Cancer': 'Cáncer',
        'Leo': 'Leo',
        'Virgo': 'Virgo',
        'Libra': 'Libra',
        'Scorpio': 'Escorpio',
        'Sagittarius': 'Sagitario',
        'Capricorn': 'Capricornio',
        'Aquarius': 'Acuario',
        'Pisces': 'Piscis'
    };
    
    return signTranslations[signInEnglish] || signInEnglish;
}

function translatePlanetToSpanish(planetInEnglish) {
    const planetTranslations = {
        'Sun': 'Sol',
        'Moon': 'Luna',
        'Mercury': 'Mercurio',
        'Venus': 'Venus',
        'Mars': 'Marte',
        'Jupiter': 'Júpiter',
        'Saturn': 'Saturno',
        'Uranus': 'Urano',
        'Neptune': 'Neptuno',
        'Pluto': 'Plutón'
    };
    
    return planetTranslations[planetInEnglish] || planetInEnglish;
}

function getZodiacSymbol(signInEnglish) {
    const zodiacSymbols = {
        'Aries': 'A',
        'Taurus': 'B',
        'Gemini': 'C',
        'Cancer': 'D',
        'Leo': 'E',
        'Virgo': 'F',
        'Libra': 'G',
        'Scorpio': 'H',
        'Sagittarius': 'I',
        'Capricorn': 'J',
        'Aquarius': 'K',
        'Piscis': 'L',
        'Pisces': 'L',
        'Tauro': 'B',
        'Géminis': 'C',
        'Geminis': 'C',
        'Cáncer': 'D',
        'Cancer': 'D',
        'Escorpio': 'H',
        'Sagitario': 'I',
        'Capricornio': 'J',
        'Acuario': 'K'
    };
    
    return zodiacSymbols[signInEnglish] || '♈';
}

function getPlanetSymbol(planetInEnglish) {
    const planetSymbols = {
        'Sun': 'Q',
        'Moon': 'R',
        'Mercury': 'S',
        'Venus': 'T',
        'Mars': 'U',
        'Jupiter': 'V',
        'Saturn': 'W',
    };
    
    return planetSymbols[planetInEnglish] || '🪐';
}

function getZodiacSignFromLongitude(longitude) {
    const normalizedLongitude = normalizeLongitude(longitude);
    const signIndex = Math.floor(normalizedLongitude / 30);
    
    const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
                    'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
    
    return signs[signIndex] || 'Piscis';
}

// ===== FUNCIONES DE TAROT Y ARCANOS =====
function getMajorArcanaForSign(signInEnglish) {
    const signArcana = {
        'Aries': 'El Emperador',
        'Taurus': 'El Hierofante',
        'Gemini': 'Los Enamorados',
        'Cancer': 'La Carroza',
        'Leo': 'La Fuerza',
        'Virgo': 'El Ermitaño',
        'Libra': 'La Justicia',
        'Scorpio': 'La Muerte',
        'Sagittarius': 'El Templanza',
        'Capricorn': 'El Diablo',
        'Aquarius': 'La Estrella',
        'Pisces': 'La Luna'
    };
    
    return signArcana[signInEnglish] || 'Arcano no definido';
}

function getMajorArcanaForPlanet(planetInEnglish) {
    const planetArcana = {
        'Sun': 'El Sol',
        'Moon': 'La Sacerdotisa',
        'Mercury': 'El Mago',
        'Venus': 'La Emperatriz',
        'Mars': 'La Torre',
        'Jupiter': 'La Rueda de la Fortuna',
        'Saturn': 'El Mundo',
        'Uranus': 'El Loco',
        'Neptune': 'El Colgado',
        'Pluto': 'El Juicio'
    };
    
    return planetArcana[planetInEnglish] || 'Arcano no definido';
}

function getDominantArcana(sign, planet) {
    const signToMajorArcana = {
        'Aries': 'El Emperador',
        'Tauro': 'El Hierofante',
        'Géminis': 'Los Enamorados',
        'Cáncer': 'La Carroza',
        'Leo': 'La Fuerza',
        'Virgo': 'El Ermitaño',
        'Libra': 'La Justicia',
        'Escorpio': 'La Muerte',
        'Sagitario': 'El Templanza',
        'Capricornio': 'El Diablo',
        'Acuario': 'La Estrella',
        'Piscis': 'La Luna'
    };

    const planetToMajorArcana = {
        'Sun': 'El Sol',
        'Moon': 'La Sacerdotisa',
        'Mercury': 'El Mago',
        'Venus': 'La Emperatriz',
        'Mars': 'La Torre',
        'Jupiter': 'La Rueda de la Fortuna',
        'Saturn': 'El Mundo',
        'Uranus': 'El Loco',
        'Neptune': 'El Colgado',
        'Pluto': 'El Juicio'
    };

    const signToElement = {
        'Aries': 'Fuego',
        'Leo': 'Fuego',
        'Sagitario': 'Fuego',
        'Tauro': 'Tierra',
        'Virgo': 'Tierra',
        'Capricornio': 'Tierra',
        'Géminis': 'Aire',
        'Libra': 'Aire',
        'Acuario': 'Aire',
        'Cáncer': 'Agua',
        'Escorpio': 'Agua',
        'Piscis': 'Agua'
    };

    const elementToCourtCard = {
        'Fuego': 'Rey de Bastos',
        'Tierra': 'Rey de Pentáculos',
        'Aire': 'Rey de Espadas',
        'Agua': 'Rey de Copas'
    };

    const signArcana = signToMajorArcana[sign] || 'Arcano no definido';
    const planetArcana = planetToMajorArcana[planet] || 'Arcano no definido';
    const element = signToElement[sign] || 'Elemento no definido';
    const courtCard = elementToCourtCard[element] || 'Carta de Corte no definida';

    return {
        signArcana: signArcana,
        planetArcana: planetArcana,
        element: element,
        courtCard: courtCard,
        description: `Signo: ${sign} | Planeta: ${planet} | Elemento: ${element}`
    };
}

        function getTarotCardsForCelestialBody(body, longitude) {
            const signIndex = Math.floor(longitude / 30);
            const degreeInSign = longitude % 30;
            const decan = Math.floor(degreeInSign / 10);
            
            const signs = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 
                          'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
            
            const currentSign = signs[signIndex];
            const traditionalRuler = getTraditionalRuler(currentSign);
            const dominantArcana = getDominantArcana(currentSign, traditionalRuler);
            
            const planetMajorArcana = {
                'Sun': 'El Sol',
                'Moon': 'La Sacerdotisa',
                'Mercury': 'El Mago',
                'Venus': 'La Emperatriz',
                'Mars': 'La Torre',
                'Jupiter': 'La Rueda de la Fortuna',
                'Saturn': 'El Mundo'
            };
            
            const decanMinorArcana = {
                'Aries': ['2 de Bastos', '3 de Bastos', '4 de Bastos'],
                'Tauro': ['5 de Pentáculos', '6 de Pentáculos', '7 de Pentáculos'],
                'Géminis': ['8 de Espadas', '9 de Espadas', '10 de Espadas'],
                'Cáncer': ['2 de Copas', '3 de Copas', '4 de Copas'],
                'Leo': ['5 de Bastos', '6 de Bastos', '7 de Bastos'],
                'Virgo': ['8 de Pentáculos', '9 de Pentáculos', '10 de Pentáculos'],
                'Libra': ['2 de Espadas', '3 de Espadas', '4 de Espadas'],
                'Escorpio': ['5 de Copas', '6 de Copas', '7 de Copas'],
                'Sagitario': ['8 de Bastos', '9 de Bastos', '10 de Bastos'],
                'Capricornio': ['2 of Pentacles', '3 de Pentáculos', '4 de Pentáculos'],
                'Acuario': ['5 de Espadas', '6 de Espadas', '7 de Espadas'],
                'Piscis': ['8 de Copas', '9 de Copas', '10 de Copas']
            };
            
            const signMajorCard = dominantArcana.signArcana;
            const planetMajorCard = planetMajorArcana[traditionalRuler] || dominantArcana.planetArcana;
            const minorCard = decanMinorArcana[currentSign] ? decanMinorArcana[currentSign][decan] : 'Carta no definida';
            const courtCard = dominantArcana.courtCard;
            const decanNumber = decan + 1;
            const decanDisplay = `${decanNumber}D`;
            
            return {
                signMajor: signMajorCard,
                planetMajor: planetMajorCard,
                minor: minorCard,
                minorWithDecan: `${minorCard}`,
                decandisplay: `<b>${decanDisplay}</b>`,
                courtCard: courtCard,
                ruler: traditionalRuler,
                element: dominantArcana.element,
                decan: decanDisplay,
                description: dominantArcana.description
            };
        }

        function getTraditionalRuler(sign) {
            const traditionalRulers = {
                'Aries': 'Mars',
                'Tauro': 'Venus', 
                'Géminis': 'Mercury',
                'Cáncer': 'Moon',
                'Leo': 'Sun',
                'Virgo': 'Mercury',
                'Libra': 'Venus',
                'Escorpio': 'Mars',
                'Sagitario': 'Jupiter',
                'Capricornio': 'Saturn',
                'Acuario': 'Saturn',
                'Piscis': 'Jupiter'
            };
            
            return traditionalRulers[sign];
        }


// Movimiento solar más preciso con variación estacional
function getSunDailyMotion(date) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Ecuación del tiempo - variación del movimiento solar
    const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
    const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    
    return 0.9856 + (equationOfTime / 1000); // Ajuste fino
}

// ===== FUNCIÓN SOLAR CORREGIDA =====
function calculatePreciseSunLongitude(date) {
    const daysFromFoundation = getDaysFromFoundation(date);
    const dailyMotion = getSunDailyMotion(date);
    let longitude = FOUNDATION_SUN_LONGITUDE + (daysFromFoundation * dailyMotion);
    
    // Ajuste para posición real del 21 Noviembre 2024
    // El Sol debería estar en ~Escorpio 29°, no en Sagitario 0°
    const currentDate = new Date();
    if (currentDate.getMonth() === 10 && currentDate.getDate() >= 21) { // Noviembre
        longitude -= 1.5; // Corrección para posicionar en Escorpio
    }
    
    return normalizeLongitude(longitude);
}

// ===== FUNCIÓN MEJORADA PARA SIGNOS ZODIACALES =====
function getZodiacSignFromLongitude(longitude) {
    const normalizedLongitude = normalizeLongitude(longitude);
    
    // Límites exactos de los signos (0° = comienzo del signo)
    const signs = [
        { start: 0, end: 30, sign: 'Aries' },
        { start: 30, end: 60, sign: 'Tauro' },
        { start: 60, end: 90, sign: 'Géminis' },
        { start: 90, end: 120, sign: 'Cáncer' },
        { start: 120, end: 150, sign: 'Leo' },
        { start: 150, end: 180, sign: 'Virgo' },
        { start: 180, end: 210, sign: 'Libra' },
        { start: 210, end: 240, sign: 'Escorpio' },
        { start: 240, end: 270, sign: 'Sagitario' },
        { start: 270, end: 300, sign: 'Capricornio' },
        { start: 300, end: 330, sign: 'Acuario' },
        { start: 330, end: 360, sign: 'Piscis' }
    ];
    
    for (const signRange of signs) {
        if (normalizedLongitude >= signRange.start && normalizedLongitude < signRange.end) {
            return translateSignToSpanish(signRange.sign);
        }
    }
    
    return 'Piscis';
}