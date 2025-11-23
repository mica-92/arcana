// Configuración de Supabase
const SUPABASE_URL = 'https://mtzdqlhketqsoqiepule.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10emRxbGhrZXRxc29xaWVwdWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjM5ODEsImV4cCI6MjA3ODQ5OTk4MX0.oGzOakzoTndR9IQK3dhPnYLpUsy19asrojB8yTpJCZc';

// Inicializar cliente de Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentSpreadType = null; // Añadir esta variable global
let currentDeckId = 'default'; // Añadir esta variable global

// Variables globales
let logHistory = [];
let decks = [];
let spreadTypes = [];
let todayCard = null;
let astrologyData = null;

// Variables separadas para cada formulario
let currentDailyEntry = {
    date: new Date(),
    notes: "",
    tarotCard: null,
    tarotOrientation: 'upright',
    deckId: 'default'
};

let currentSpreadEntry = {
    date: new Date(),
    notes: "",
    spreadType: null,
    spreadCards: [],
    deckId: 'default'
};

// ===== DATOS FUNDACIONALES ACTUALIZADOS (19 Nov 2025, 23:51 UT) =====
const FOUNDATION_DATE = new Date('2025-11-19T23:51:00Z');
const FOUNDATION_SUN_LONGITUDE = 237.9067; // 27°54'24" Scorpio = 237°54'24"
const FOUNDATION_MOON_LONGITUDE = 234.7703; // 24°46'13" Scorpio = 234°46'13"
const SUN_DAILY_MOTION = 0.985647;
const MOON_DAILY_MOTION = 13.176;