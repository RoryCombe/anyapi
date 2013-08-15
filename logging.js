// A general, centrally handled logging mechanism
//
//-----------------------------------------------------------

var helpers = require("./helpers");

// Severity levels
var Severity = {
	Info: "Info",
	Warning: "Warning",
	Error: "Error"
};

// ###Helper methods

// Log a verbose message with a datetime stamp and severity level
function logMessage(severity, message) {
	console.log("[" + helpers.getDateNow() + "]\t" + severity + ":\t" + message);
};

// Log a plain message with text only
function logMessagePlain(message) {
	console.log("[" + helpers.getDateNow() + "]\t" + message);
};

// ###Exported methods

// Standard way to log a plain message without any options
exports.out = function (message) {
	logMessagePlain(message);
};

// Log a message with "Info" severity
exports.logInfo = function (message) {
	logMessage(Severity.Info, message);
};

// Log a message with "Warning" severity
exports.logWarning = function (message) {
	logMessage(Severity.Warning, message);
};

// Log a message with "Error" severity
exports.logError = function (message) {
	logMessage(Severity.Error, message);
};