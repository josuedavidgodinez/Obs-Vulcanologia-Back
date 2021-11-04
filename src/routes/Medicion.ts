import { Router } from 'express';
import { listaTablas } from "../database/listaTablas";
import { statusCode } from "../models/statusCode";
import * as sensorService from "../services/SensorService";
import * as timeService from "../services/TimeService";
const med: Router =  Router();

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
    const fecha_i = timeService.validateDTurlFormat(url_query.fhi, timeService.operacion.resta);
    const fecha_f = timeService.validateDTurlFormat(url_query.fhf, timeService.operacion.suma);
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
    const fecha_ayer = timeService.addHours(fecha_actual, -0.5); // Cambiar el tamaño de las horas respecto al tamaño del servidor donde se va a alojar.
    const fecha_compuesta_inicial = timeService.date2QDate(fecha_ayer);
    const fecha_compuesta_final = timeService.date2QDate(fecha_actual);

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