import { Router } from 'express';
import { listaTablas } from "../database/listaTablas";
import { statusCode } from "../models/statusCode";
import * as sensorService from "../services/SensorService";
const med: Router =  Router();

function validateDateFormat(datetime:string): string | null{
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

function date2QDate(d: Date): string {
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
    return f[2] + '-' + f[1] + '-' + f[0] + ' ' + a[1] + '.' + d.getUTCMilliseconds();
}
function addHours(date: Date, hours: number): Date{
    const milisInHour = 3600000;
    const newMilis = hours * milisInHour;
    return new Date(date.valueOf() + Math.floor(newMilis));
}

// host/med/tabla?fhi=_fechaHoraInicio&fhf=_fechaHoraFin
med.get('/:tabla', function(req,  res) {
    const tabla: string = listaTablas[req.params.tabla];
    if(!tabla) {
        res.status(statusCode.badRequest)
        .json({
            message : "Tabla Invalida",
            status: statusCode.badRequest
        });
        return;
    }
    const url_query: any = req.query;
    // fechaHora = yyyyMMddHHmm
    const fecha_i = validateDateFormat(url_query.fhi);
    const fecha_f = validateDateFormat(url_query.fhf);
    if (!fecha_i) {
        res.status(statusCode.badRequest)
        .json({
            message : "Fecha de Inicio Invalida",
            status: statusCode.badRequest
        });
        return;
    }  
    if (!fecha_f) {
        res.status(statusCode.badRequest)
        .json({
            message : "Fecha de Final Invalida",
            status: statusCode.badRequest
        });
        return;
    }
    sensorService.getSensors(tabla, fecha_i, fecha_f).then(data => {
        res.status(statusCode.ok)
        .json({
            status: statusCode.ok,
            data
        });
    }).catch((err: Error) => {
        res.status(statusCode.conflict)
        .json({
            status: statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});

med.get('/:tabla/LecturaInicio', function(req,  res) {
    const tabla: string = listaTablas[req.params.tabla];
    if(!tabla) {
        res.status(statusCode.badRequest)
        .json({
            message : "Tabla Invalida",
            status: statusCode.badRequest
        });
        return;
    }
    const fecha_actual = new Date();
    const fecha_ayer = addHours(fecha_actual, -24);
    const fecha_compuesta_inicial = date2QDate(fecha_actual);
    const fecha_compuesta_final = date2QDate(fecha_ayer);

    sensorService.getSensors(tabla, fecha_compuesta_inicial, fecha_compuesta_final).then(data => {
        res.status(statusCode.ok)
        .json({
            status: statusCode.ok,
            data
        });
    }).catch((err: Error) => {
        res.status(statusCode.conflict)
        .json({
            status: statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});

export default med;