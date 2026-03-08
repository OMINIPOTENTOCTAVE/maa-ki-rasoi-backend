const prisma = require("../../prisma");
const authService = require("../auth/auth.service");
const whatsappService = require("./whatsapp.service");

class NotificationController {
    /**
     * Send notification to one or all customers
     * POST /api/system/notifications/send
     */
    async sendNotification(req, res) {
        try {
            const { target, title, content, channel = 'SMS' } = req.body;
            const adminId = req.user.id;

            if (!content) {
                return res.status(400).json({ success: false, message: "Notification content is required" });
            }

            let recipients = [];

            if (target === 'ALL') {
                recipients = await prisma.customer.findMany({
                    select: { id: true, phone: true, name: true }
                });
            } else if (target === 'SUBSCRIBERS') {
                recipients = await prisma.customer.findMany({
                    where: { subscriptions: { some: { status: 'Active' } } },
                    select: { id: true, phone: true, name: true }
                });
            } else if (target.includes(',')) {
                // Individual IDs
                const ids = target.split(',').map(id => id.trim());
                recipients = await prisma.customer.findMany({
                    where: { id: { in: ids } },
                    select: { id: true, phone: true, name: true }
                });
            } else {
                // Single ID
                const recipient = await prisma.customer.findUnique({
                    where: { id: target },
                    select: { id: true, phone: true, name: true }
                });
                if (recipient) recipients.push(recipient);
            }

            if (recipients.length === 0) {
                return res.status(404).json({ success: false, message: "No recipients found" });
            }

            const results = [];
            for (const person of recipients) {
                if (!person.phone) continue;

                let success = false;
                try {
                    if (channel === 'WHATSAPP') {
                        await whatsappService.sendMessage(person.phone, content);
                        success = true;
                    } else {
                        // Default to SMS (OTP route or Bulk SMS)
                        // Using authService.sendSMS as a proxy for mock purposes
                        await authService.sendSMS(person.phone, content);
                        success = true;
                    }
                } catch (err) {
                    console.error(`Failed to send ${channel} to ${person.phone}:`, err.message);
                }

                // Log to Database
                await prisma.notification.create({
                    data: {
                        userId: person.id,
                        phone: person.phone,
                        title,
                        content,
                        type: target === 'ALL' || target === 'SUBSCRIBERS' ? target : 'INDIVIDUAL',
                        channel,
                        status: success ? 'SENT' : 'FAILED',
                        adminId
                    }
                });

                results.push({ phone: person.phone, success });
            }

            res.json({
                success: true,
                message: `Processed ${recipients.length} notifications`,
                results
            });

        } catch (error) {
            console.error("[NOTIFICATION_ERROR]", error.message);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get notification history
     * GET /api/system/notifications
     */
    async getHistory(req, res) {
        try {
            const notifications = await prisma.notification.findMany({
                orderBy: { sentAt: 'desc' },
                take: 50
            });
            res.json({ success: true, data: notifications });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = new NotificationController();
