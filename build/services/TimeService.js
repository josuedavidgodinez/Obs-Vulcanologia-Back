"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeToUTC = exports.addMiliseconds = exports.addHours = exports.date2number = exports.date2QDate = exports.validateDTurlFormat = void 0;
const convert2Locale = (date) => {
    return date.toLocaleString("es-MX", {
        timeZone: 'America/Guatemala',
        hour12: false,
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};
const splitLocale = (date) => {
    const s = convert2Locale(date);
    const parts = [];
    const a = s.split(' ');
    const f = a[0].split('/');
    const h = a[1].split(':');
    for (let index = 2; index >= 0; index--) {
        const element = f[index];
        parts.push(element);
    }
    h.forEach(element => parts.push(element));
    parts.push(date.getMilliseconds().toString());
    parts[0] = parts[0].substring(0, 4);
    return parts;
};
const getDateParts = (date) => {
    const initStr = splitLocale(date);
    const nD = new Date(+initStr[0], +initStr[1] - 1, +initStr[2], +initStr[3], +initStr[4], +initStr[5], +initStr[6]);
    if (date.getTime() != nD.getTime()) {
        const tmp = +initStr[1];
        initStr[1] = initStr[2];
        initStr[2] = tmp.toString();
    }
    return initStr;
};
function validateDTurlFormat(datetime) {
    if (!datetime)
        return null;
    if (datetime.length != 12)
        return null;
    if (!datetime.match(/^(\d{12})/))
        return null;
    let newDTS = datetime.substr(0, 4);
    newDTS += "-" + datetime.substr(4, 2);
    newDTS += "-" + datetime.substr(6, 2);
    newDTS += " " + datetime.substr(8, 2);
    newDTS += ":" + datetime.substr(10);
    try {
        let d = new Date(newDTS);
        return newDTS;
    }
    catch (_a) {
        return null;
    }
}
exports.validateDTurlFormat = validateDTurlFormat;
function date2QDate(d) {
    const dp = getDateParts(d);
    return dp[0] + '-' + dp[1] + '-' + dp[2] + ' ' + dp[3] + ':' + dp[4] + ':' + dp[5] + '.' + dp[6];
}
exports.date2QDate = date2QDate;
function date2number(d) {
    const dp = getDateParts(d);
    return dp[0] + dp[1] + dp[2] + dp[3] + dp[4] + dp[5];
}
exports.date2number = date2number;
function addHours(date, hours) {
    const milisInHour = 3600000;
    const newMilis = hours * milisInHour;
    return new Date(date.valueOf() + Math.floor(newMilis));
}
exports.addHours = addHours;
function addMiliseconds(date, miliseconds) {
    return new Date(date.valueOf() + Math.floor(miliseconds));
}
exports.addMiliseconds = addMiliseconds;
function changeToUTC(date) {
    const d = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    return new Date(d);
}
exports.changeToUTC = changeToUTC;
//# sourceMappingURL=TimeService.js.map