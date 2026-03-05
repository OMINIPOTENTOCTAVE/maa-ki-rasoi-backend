const { toZonedTime, format, fromZonedTime } = require('date-fns-tz');
const { addDays, isSunday, startOfDay, differenceInDays } = require('date-fns');
const prisma = require('../prisma');

const TIMEZONE = 'Asia/Kolkata';
const PAUSE_CUTOFF_HOUR = 22; // 10 PM IST

/**
 * Returns the current date/time converted to IST.
 * @returns {Date} Date object in IST
 */
function getISTTimestamp() {
    return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Converts any UTC date to IST.
 * @param {Date|string|number} date 
 * @returns {Date}
 */
function toIST(date) {
    return toZonedTime(date, TIMEZONE);
}

/**
 * Returns midnight (00:00:00) IST for a given date.
 * @param {Date|string|number} date 
 * @returns {Date}
 */
function startOfISTDay(date) {
    const istDate = toZonedTime(date, TIMEZONE);
    return startOfDay(istDate);
}

/**
 * Checks if the given date is a Sunday in IST.
 * @param {Date|string|number} date 
 * @returns {boolean}
 */
function isISTSunday(date) {
    const istDate = toZonedTime(date, TIMEZONE);
    return isSunday(istDate);
}

/**
 * Checks if an IST date is a Holiday.
 * @param {Date|string|number} date 
 * @returns {Promise<boolean>}
 */
async function isHoliday(date) {
    const istStartOfDay = startOfISTDay(date);

    // Convert back to UTC to query Prisma correctly (since Prisma stores UTC equivalents)
    const utcStartOfDay = fromZonedTime(istStartOfDay, TIMEZONE);

    const holiday = await prisma.holiday.findUnique({
        where: { date: utcStartOfDay }
    });

    return !!holiday && holiday.noDelivery;
}

/**
 * Checks if current IST time is past the 10 PM cutoff.
 * @returns {boolean}
 */
function isAfterCutoff() {
    const nowIST = getISTTimestamp();
    return nowIST.getHours() >= PAUSE_CUTOFF_HOUR;
}

/**
 * Calculates effective date for pauses/starts based on the 10 PM rule.
 * - Before 10 PM: tomorrow
 * - After 10 PM: day after tomorrow
 * - If Sunday: push to Monday
 * @returns {Date} The startOfISTDay representation of the effective date.
 */
function getEffectiveDate() {
    const nowIST = getISTTimestamp();
    let baseEffective = addDays(nowIST, isAfterCutoff() ? 2 : 1);

    if (isSunday(baseEffective)) {
        baseEffective = addDays(baseEffective, 1);
    }

    return startOfISTDay(baseEffective);
}

/**
 * Recursively finds the next valid delivery date (skipping Sundays & Holidays).
 * @param {Date} date (Start of day IST)
 * @returns {Promise<Date>}
 */
async function getNextDeliveryDate(date) {
    let nextDate = addDays(date, 1);

    while (isSunday(nextDate) || await isHoliday(nextDate)) {
        nextDate = addDays(nextDate, 1);
    }

    return startOfISTDay(nextDate);
}

/**
 * Adds exact delivery days (skipping Sundays and Holidays).
 * @param {Date} startDate (Start of day IST)
 * @param {number} days 
 * @returns {Promise<Date>}
 */
async function addDeliveryDays(startDate, days) {
    let currentDate = startOfISTDay(startDate);
    let daysAdded = 0;

    while (daysAdded < days) {
        currentDate = addDays(currentDate, 1);
        if (!isSunday(currentDate) && !(await isHoliday(currentDate))) {
            daysAdded++;
        }
    }

    return currentDate;
}

/**
 * Counts exact delivery days between start and end date (inclusive), skipping Sun/Holidays.
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {Promise<number>}
 */
async function countDeliveryDays(startDate, endDate) {
    let currentDate = startOfISTDay(startDate);
    const finalDate = startOfISTDay(endDate);
    let count = 0;

    // Safety break to prevent infinite loops if dates are inverted
    if (currentDate > finalDate) return 0;

    while (currentDate <= finalDate) {
        if (!isSunday(currentDate) && !(await isHoliday(currentDate))) {
            count++;
        }
        currentDate = addDays(currentDate, 1);
    }

    return count;
}

/**
 * Calculates exact ending date of a subscription. 
 * E.g., if totalTiffins = 6, it means startDate + 5 delivery days.
 * @param {Date} startDate 
 * @param {number} totalTiffins 
 * @returns {Promise<Date>}
 */
async function calculateEndDate(startDate, totalTiffins) {
    if (totalTiffins <= 1) return startOfISTDay(startDate);
    return addDeliveryDays(startDate, totalTiffins - 1);
}

/**
 * Calculates remaining delivery days in the current Mon-Sat week starting from given date.
 * (Used for pro-rated subscriptions)
 * @param {Date} startDate 
 * @returns {Promise<number>}
 */
async function calculateProRatedTiffins(startDate) {
    let currentDate = startOfISTDay(startDate);
    let tiffins = 0;

    if (isSunday(currentDate)) return 0;

    while (currentDate.getDay() !== 0) { // While not Sunday
        if (!(await isHoliday(currentDate))) {
            tiffins++;
        }
        currentDate = addDays(currentDate, 1);
        if (currentDate.getDay() === 0) break; // Stop when we hit next Sunday
    }

    return tiffins;
}

module.exports = {
    getISTTimestamp,
    toIST,
    startOfISTDay,
    isISTSunday,
    isHoliday,
    isAfterCutoff,
    getEffectiveDate,
    getNextDeliveryDate,
    addDeliveryDays,
    countDeliveryDays,
    calculateEndDate,
    calculateProRatedTiffins,
    TIMEZONE,
    PAUSE_CUTOFF_HOUR
};
