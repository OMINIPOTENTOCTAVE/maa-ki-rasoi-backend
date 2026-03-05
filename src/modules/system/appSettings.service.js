const prisma = require('../../prisma');

/**
 * AppSettings Service 
 * Provides an in-memory cache with a 5-minute TTL for V4.0 Feature Flags.
 */

// Basic in-memory cache
let settingsCache = {};
let lastFetchTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const DEFAULT_SETTINGS = {
    ACCEPT_NEW_SUBSCRIPTIONS: { value: 'true', type: 'BOOLEAN' },
    COD_ENABLED: { value: 'true', type: 'BOOLEAN' },
    ONE_TIME_ORDERS_ENABLED: { value: 'true', type: 'BOOLEAN' },
    AUTO_RENEW_ENABLED: { value: 'false', type: 'BOOLEAN' },
    PAUSE_CUTOFF_TIME_IST: { value: '22:00', type: 'STRING' },
    MAX_PAUSE_DAYS: { value: '30', type: 'NUMBER' },
    COD_DEPOSIT_AMOUNT: { value: '500', type: 'NUMBER' },
    MENU_PUBLISH_DEADLINE_IST: { value: '21:45', type: 'STRING' },
    MENU_VISIBLE_FROM_HOUR_IST: { value: '6', type: 'NUMBER' },
    DELIVERY_DAYS: { value: '[1,2,3,4,5,6]', type: 'JSON' }
};

/**
 * Parses the string value into its intended type.
 */
function parseValue(value, type) {
    if (!value) return null;
    switch (type) {
        case 'BOOLEAN': return value === 'true';
        case 'NUMBER': return Number(value);
        case 'JSON':
            try { return JSON.parse(value); }
            catch { return null; }
        case 'STRING':
        default: return value;
    }
}

/**
 * Ensures the database has the default settings.
 * Runs once internally when needed.
 */
async function initializeDefaults() {
    for (const [key, defaultData] of Object.entries(DEFAULT_SETTINGS)) {
        await prisma.appSetting.upsert({
            where: { key },
            update: {}, // Don't overwrite if it exists
            create: {
                key,
                value: defaultData.value,
                type: defaultData.type
            }
        });
    }
}

/**
 * Retrieves all settings as a key-value object.
 * Returns from memory if TTL hasn't expired.
 * @param {boolean} forceRefresh - Ignore cache and hit DB
 */
async function getAllSettings(forceRefresh = false) {
    const now = Date.now();

    if (!forceRefresh && (now - lastFetchTime < CACHE_TTL_MS)) {
        return settingsCache;
    }

    // Database lookup
    const records = await prisma.appSetting.findMany();

    if (records.length === 0) {
        await initializeDefaults();
        return getAllSettings(true); // Retry after seed
    }

    const newCache = {};
    for (const record of records) {
        newCache[record.key] = parseValue(record.value, record.type);
    }

    settingsCache = newCache;
    lastFetchTime = now;

    return settingsCache;
}

/**
 * Gets a specific setting. Uses the cached dictionary.
 * @param {string} key 
 */
async function getSetting(key) {
    const settings = await getAllSettings();
    if (settings[key] !== undefined) {
        return settings[key];
    }

    // Fallback to default if somehow missing
    const defaultData = DEFAULT_SETTINGS[key];
    if (defaultData) {
        return parseValue(defaultData.value, defaultData.type);
    }

    return null;
}

/**
 * Updates a setting and immediately invalidates the cache.
 */
async function updateSetting(key, value) {
    const valString = typeof value === 'object' ? JSON.stringify(value) : String(value);

    await prisma.appSetting.update({
        where: { key },
        data: { value: valString }
    });

    // Invalidate cache immediately so all nodes re-fetch on next request
    lastFetchTime = 0;
}

/**
 * Manually bust cache (usually called by admin endpoints mapping to config changes)
 */
function bustCache() {
    lastFetchTime = 0;
    settingsCache = {};
}

module.exports = {
    getAllSettings,
    getSetting,
    updateSetting,
    bustCache,
    initializeDefaults
};
