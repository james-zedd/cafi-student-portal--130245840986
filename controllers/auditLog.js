const AuditLog = require('../models/AuditLog');
const User = require('../models/User');

const createAuditLog = async ({ usrId, route, method, changes }) => {
    try {
        const usr = await User.findById(usrId).select('name roles');

        if (!usr) {
            console.error(
                `Failed to create audit log -- user with id ${usrId} not found.`
            );
            return;
        }

        await AuditLog.create({
            user: {
                name: usr.name,
                roles: usr.roles,
            },
            route: route,
            method: method,
            changes: changes,
        });
    } catch (error) {
        console.error(`Failed to create audit log -- ${error.message}`);
    }
};

module.exports = {
    createAuditLog,
};
