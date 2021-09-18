"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeToUTC = exports.addMiliseconds = exports.addHours = exports.date2number = exports.date2QDate = exports.validateDTurlFormat = void 0;
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
    const s = d.toLocaleString("es-GT", {
        timeZone: 'America/Guatemala',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const a = s.split(' ');
    const f = a[0].split('/');
    return f[2].substring(0, 4) + '-' + f[1] + '-' + f[0] + ' ' + a[1] + '.' + d.getUTCMilliseconds();
}
exports.date2QDate = date2QDate;
function date2number(d) {
    const s = d.toLocaleString("es-GT", {
        timeZone: 'America/Guatemala',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const a = s.split(' ');
    const f = a[0].split('/');
    const h = a[1].split(':');
    return f[2].substring(0, 4) + f[1] + f[0] + h[0] + h[1] + h[2];
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