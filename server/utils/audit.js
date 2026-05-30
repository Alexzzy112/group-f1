const AuditLog = require('../models/AuditLog');

const logAudit = async ({ user, action, resource, resourceId, details, ipAddress, userAgent }) => {
  try {
    await AuditLog.create({
      user: user,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

module.exports = { logAudit };
