
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
    const s = d.toLocaleString("es-GT",{
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
    return f[2].substring(0,4) + '-' + f[1] + '-' + f[0] + ' ' + a[1] + '.' + d.getUTCMilliseconds();
}
export function date2number(d: Date): string {
    const s = d.toLocaleString("es-GT",{
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
    const h = a[1].split(':')
    return f[2].substring(0,4) + f[1] + f[0] + h[0] + h[1] + h[2];
}
export function addHours(date: Date, hours: number): Date{
    const milisInHour = 3600000;
    const newMilis = hours * milisInHour;
    return new Date(date.valueOf() + Math.floor(newMilis));
}