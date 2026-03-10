const prisma = require("../prisma");

/**
 * Express middleware to automatically log critical admin actions into the append-only AuditLog table.
 * Must be placed AFTER `authenticateAdmin` in the route chain.
 *
 * @param {string} entity - The business entity being changed (e.g., "Menu", "AppSetting", "Subscription")
 * @returns Express Middleware
 */
const auditLog = (entity) => {
    return async (req, res, next) => {
        // We only care about mutations for audit trails
        if (req.method === 'GET' || req.method === 'OPTIONS') {
            return next();
        }

        // We capture the original send function to log the result
        const originalSend = res.send;

        res.send = function (body) {
            // Restore the original send
            res.send = originalSend;

            // Fire and forget the audit log creation (non-blocking)
            if (res.statusCode >= 200 && res.statusCode < 400 && req.user && req.user.role === 'admin') {
                const action = req.method; // POST, PATCH, DELETE
                const adminId = req.user.id;
                const ipAddress = req.ip || req.connection.remoteAddress;

                // Try to infer specific entity ID
                const entityId = req.params?.id || req.body?.id || null;

                // Scrub sensitive data from body before logging
                const safeBody = { ...req.body };
                if (safeBody.password) delete safeBody.password;
                if (safeBody.token) delete safeBody.token;

                const details = {
                    endpoint: req.originalUrl,
                    payload: safeBody,
                    status: res.statusCode
                };

                prisma.auditLog.create({
                    data: {
                        adminId,
                        action,
                        targetType: entity,
                        targetId: entityId || "N/A",
                        after: details,
                        ipAddress
                    }
                }).catch(err => {
                    console.error("[AUDIT-LOG-ERROR] Failed to write to append-only log:", err);
                });
            }

            return res.send(body);
        };

        next();
    };
};

module.exports = { auditLog };
