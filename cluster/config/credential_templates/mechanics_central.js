var system = require("system")

module.exports = {
	username: system.env["MECHANICS_USER_ID"],
	password: system.env["MECHANICS_USER_PASSWORD"]
};

