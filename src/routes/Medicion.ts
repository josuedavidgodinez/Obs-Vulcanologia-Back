import { Router } from 'express';
import pool from '../database/db';
import { statusCode } from "../models/statusCode";
import * as sensorService from "../services/SensorService";
import * as SensorRealTime from '../services/SensorRealTimeService';
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

// host/med?fhi=_fechaHoraInicio&fhf=_fechaHoraFin&localTime=_TrueOrFalse
med.get('/', function(req,  res) {
    const url_query: any = req.query;
    // fechaHora = yyyyMMddHHmm
    const inLocalTime = url_query.localTime == 'true';
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
    sensorService.getSensors(fecha_i, fecha_f, inLocalTime).then(data => {
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

med.get('/LecturaInicio', function(req,  res) {
    const url_query: any = req.query;
    const fecha_actual = new Date();
    const mes = fecha_actual.getMonth() + 1
    const dia = fecha_actual.getDate();
    const dia_anterior = fecha_actual.getDate()-1;
    const fecha_compuesta_inicial = fecha_actual.getFullYear() + '-' + mes + '-' + dia_anterior + ' '+ fecha_actual.getHours() + ':' + fecha_actual.getMinutes() + ':' + fecha_actual.getSeconds() + ':' + fecha_actual.getMilliseconds();
    const fecha_compuesta_final = fecha_actual.getFullYear() + '-' + mes + '-' + dia + ' '+ fecha_actual.getHours() + ':' + fecha_actual.getMinutes() + ':' + fecha_actual.getSeconds() + ':' + fecha_actual.getMilliseconds();



    SensorRealTime.getSensors(fecha_compuesta_inicial, fecha_compuesta_final, true).then(data => {
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