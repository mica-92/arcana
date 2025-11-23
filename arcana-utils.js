// Funciones para traducción y arcanos

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

function getMinorArcanaForElement(element) {
    const elementMinorArcana = {
        'Fire': 'As de Bastos',
        'Water': 'As de Copas',
        'Air': 'As de Espadas',
        'Earth': 'As de Pentáculos'
    };
    
    return elementMinorArcana[element] || 'Carta menor no definida';
}

function getPlanetEmoji(planet) {
    const planetEmojis = {
        'Sun': '☀️',
        'Moon': '🌙',
        'Mercury': '☿',
        'Venus': '♀',
        'Mars': '♂',
        'Jupiter': '♃',
        'Saturn': '♄'
    };
    
    return planetEmojis[planet] || '🪐';
}