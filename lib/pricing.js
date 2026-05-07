/**
 * Global Pricing Strategy for Quran App
 * Based on PPP (Purchasing Power Parity)
 * Prices are in SAR (Saudi Riyal)
 */
export const REGIONAL_PRICES = {
    '+966': 120, // Saudi Arabia
    '+971': 120, // UAE
    '+974': 120, // Qatar
    '+965': 120, // Kuwait
    '+973': 79,  // Bahrain
    '+968': 73,  // Oman
    '+967': 7,   // Yemen
    '+962': 37,  // Jordan
    '+218': 32,  // Libya
    '+964': 32,  // Iraq
    '+216': 20,  // Tunisia
    '+213': 24,  // Algeria
    '+212': 23,  // Morocco
    '+20': 16,   // Egypt
    '+970': 17,  // Palestine
    '+963': 6,   // Syria
    '+249': 7,   // Sudan
    '+222': 7,   // Mauritania
    '+961': 19,  // Lebanon
    '+90': 46,   // Turkey
    '+60': 44,   // Malaysia
    '+98': 26,   // Iran
    '+62': 18,   // Indonesia
    '+92': 12,   // Pakistan
    '+880': 8,   // Bangladesh
    '+234': 8,   // Nigeria
    'Global': 50 // Default for other countries
};

export const DEFAULT_PRICE = 120;

/**
 * Calculates the price for a given country code
 * @param {string} countryCode e.g. "+966"
 * @returns {number} Price in SAR
 */
export function getPriceByCountry(countryCode) {
    if (!countryCode) return DEFAULT_PRICE;
    
    // Normalize code (ensure it starts with + if it's a number)
    let normalized = countryCode.trim();
    if (/^\d+$/.test(normalized)) normalized = '+' + normalized;
    
    return REGIONAL_PRICES[normalized] || REGIONAL_PRICES['Global'] || DEFAULT_PRICE;
}
