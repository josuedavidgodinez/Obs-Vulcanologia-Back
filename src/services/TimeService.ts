/**
 * 
 * @param date fecha a formatear al área local
 * @returns Devuelve fecha con la nueva zona horaria
 */
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
/**
 * 
 * @param date fecha a separar en dd,mm, yyy
 * @returns devuelve arreglo con las partes de la fecha 
 */
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
/**
 * 
 * @param date Fecha a separar
 * @returns Partes de fecha
 */
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

export enum operacion {
    suma = 1,
    resta = -1
}
/**
 * 
 * @param datetime fecha a la cual se validará formato
 * @param signo Signo + o -
 * @returns devuelve la fecha si es válida o null si se encontró algún incoveniente
 */
export function validateDTurlFormat(datetime:string, signo: operacion): string | null{
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
        d = addMiliseconds(d, signo*60*1000);
        return date2QDate(d);
    }catch{
        return null;
    }
}
/**
 * 
 * @param d fecha a obtener partes
 * @returns fecha en el formato dd-mm-yyyy hh:mm:ss:ms
 */
export function date2QDate(d: Date): string {
    const dp = getDateParts(d);
    return dp[0] + '-' + dp[1] + '-' + dp[2] + ' ' + dp[3] + ':' + dp[4] + ':' + dp[5] + '.' + dp[6];
}
/**
 * 
 * @param d Fecha
 * @returns devuelve la fecha ddmmyy
 */
export function date2number(d: Date): string {
    const dp = getDateParts(d);
    return dp[0] + dp[1] + dp[2] + dp[3] + dp[4] + dp[5];
}
/**
 * 
 * @param date fecha a sumar o restar horas
 * @param hours Horas las cuales se hará la diferencia
 * @returns Devuelve la fecha con la diferencia de hora solicitada
 */
export function addHours(date: Date, hours: number): Date{
    const milisInHour = 3600000;
    const newMilis = hours * milisInHour;
    return new Date(date.valueOf() + Math.floor(newMilis));
}

/**
 * 
 * @param date fecha a sumar o restar milisegundos
 * @param miliseconds Milisegundos a sumar o restar
 * @returns Nueva fecha con la diferencia solicitada
 */
export function addMiliseconds(date: Date, miliseconds: number): Date{
    return new Date(date.valueOf() + Math.floor(miliseconds));
}
/**
 * 
 * @param date Fecha a convertir
 * @returns devuelve la fecha en UTC
 */
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