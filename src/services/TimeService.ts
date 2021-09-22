
const convert2Locale = (date:Date): string => {
    return date.toLocaleString("es-MX",{
        timeZone: 'America/Guatemala',
        hour12: false,
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}
const splitLocale = (date: Date): string[] => {
    const s = convert2Locale(date);
    const parts: string[] = [];
    const a = s.split(' ');
    const f = a[0].split('/');
    const h = a[1].split(':');
    for (let index = 2; index >= 0; index--) {
        const element = f[index];
        parts.push(element);
    }
    h.forEach(element => parts.push(element));
    parts.push(date.getMilliseconds().toString());
    parts[0] = parts[0].substring(0,4);
    return parts;
}
const getDateParts = (date: Date): string[] => {
    const initStr = splitLocale(date);
    const nD = new Date(
        +initStr[0],
        +initStr[1] - 1,
        +initStr[2],
        +initStr[3],
        +initStr[4],
        +initStr[5],
        +initStr[6]
    );
    if(date.getTime() != nD.getTime()){
        const tmp = +initStr[1];
        initStr[1] = initStr[2];
        initStr[2] = tmp.toString();
    }
    return initStr;
}

export function validateDTurlFormat(datetime:string): string | null{
    if (!datetime) return null;
    if (datetime.length != 12) return null;
    if (!datetime.match(/^(\d{12})/)) return null;
    let newDTS = datetime.substr(0,4);
    newDTS += "-" + datetime.substr(4,2);
    newDTS += "-" + datetime.substr(6,2);
    newDTS += " " + datetime.substr(8,2);
    newDTS += ":" + datetime.substr(10);
    try{
        let d = new Date(newDTS);
        return newDTS;
    }catch{
        return null;
    }
}
export function date2QDate(d: Date): string {
    const dp = getDateParts(d);
    return dp[0] + '-' + dp[1] + '-' + dp[2] + ' ' + dp[3] + ':' + dp[4] + ':' + dp[5] + '.' + dp[6];
}
export function date2number(d: Date): string {
    const dp = getDateParts(d);
    return dp[0] + dp[1] + dp[2] + dp[3] + dp[4] + dp[5];
}
export function addHours(date: Date, hours: number): Date{
    const milisInHour = 3600000;
    const newMilis = hours * milisInHour;
    return new Date(date.valueOf() + Math.floor(newMilis));
}
export function addMiliseconds(date: Date, miliseconds: number): Date{
    return new Date(date.valueOf() + Math.floor(miliseconds));
}
export function changeToUTC(date: Date): Date{
    const d = Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    );
    return new Date(d);
}