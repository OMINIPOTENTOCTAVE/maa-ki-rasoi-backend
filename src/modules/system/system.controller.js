const prisma = require("../../prisma");
const appSettingsService = require("./appSettings.service");

// --- App Settings ---

const getSettings = async (req, res) => {
    try {
        const settings = await prisma.appSetting.findMany({
            orderBy: { key: 'asc' }
        });
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { key, value, description } = req.body;

        const setting = await prisma.appSetting.upsert({
            where: { key },
            update: { value, description },
            create: { key, value, description }
        });

        // Invalidate the cache to ensure immediate system propagation
        appSettingsService.bustCache();

        res.json({ success: true, message: "Setting updated successfully", data: setting });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- Holiday Management ---

const getHolidays = async (req, res) => {
    try {
        const holidays = await prisma.holiday.findMany({
            orderBy: { date: 'desc' }
        });
        res.json({ success: true, data: holidays });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createHoliday = async (req, res) => {
    try {
        const { date, reason } = req.body;

        if (!date || !reason) {
            return res.status(400).json({ success: false, message: "Date and reason are required" });
        }

        // Must normalize date to UTC equivalent of IST startOfDay 
        // to match `timeUtils.js` lookup signature
        const { fromZonedTime } = require('date-fns-tz');
        const startOfISTDay = require('../../utils/timeUtils').startOfISTDay;

        const istStartOfDay = startOfISTDay(new Date(date));
        const utcStartOfDay = fromZonedTime(istStartOfDay, 'Asia/Kolkata');

        const holiday = await prisma.holiday.upsert({
            where: { date: utcStartOfDay },
            update: { reason, noDelivery: true },
            create: { date: utcStartOfDay, reason, noDelivery: true }
        });

        res.json({ success: true, message: "Holiday scheduled successfully.", data: holiday });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteHoliday = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.holiday.delete({ where: { id } });
        res.json({ success: true, message: "Holiday revoked successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSetting,
    getHolidays,
    createHoliday,
    deleteHoliday
};
