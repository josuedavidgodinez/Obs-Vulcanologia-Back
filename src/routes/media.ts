import { Router } from 'express';
import { listaImagenes, listaTablas } from "../database/listaTablas";
import { getImgPath, getImgPath2, getImgPathList } from "../services/MediaService";
import * as timeService from "../services/TimeService";
import { statusCode } from "../models/statusCode";
import { getLastPhoto } from '../services/GetPhoto';

const media: Router =  Router();

const badRequestObject = (message: string) => {
    return {
        message,
        status: statusCode.badRequest
    };
}

// host/media/24h/estacion/sensor?fh=_fechaHora
media.get('/24h/:estacion/:sensor', (req,  res) => {    
    const estacion: string = listaImagenes[req.params.estacion];
    const sensor: number = +req.params.sensor;
    const tipo: string = "24Hrs";
    if(!estacion) {
        res.status(statusCode.badRequest)
        .json(badRequestObject("Tabla Invalida"));
        return;
    }
    if(!Number.isInteger(sensor)) {
        res.status(statusCode.badRequest)
        .json(badRequestObject("Sensor Invalido"));
        return;
    }
    if(sensor < 1 && sensor > 4){
        res.status(statusCode.badRequest)
        .json(badRequestObject("Sensor Invalido"));
        return;
    }
    const url_query: any = req.query;
    const fecha = timeService.validateDTurlFormat(url_query.fh, timeService.operacion.suma);
    getImgPath(estacion, sensor, tipo, fecha).then(path => {
        res.status(statusCode.ok)
        .sendFile(path);
    }).catch((err: Error) => {
        res.status(statusCode.conflict)
        .json({
            status: statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});

// host/media/eg/estacion/sensor?fhi=_fechaHoraInicio&fhf=_fechaHoraFin
media.get('/eg/:estacion/:sensor', (req,  res) => {    
    const estacion: string = listaImagenes[req.params.estacion];
    const sensor: number = +req.params.sensor;
    const tipo: string = 'eg';
    if(!estacion) {
        res.status(statusCode.badRequest)
        .json(badRequestObject("Tabla Invalida"));
        return;
    }
    if(!Number.isInteger(sensor)) {
        res.status(statusCode.badRequest)
        .json(badRequestObject("Sensor Invalido"));
        return;
    }
    if(sensor < 1 && sensor > 4){
        res.status(statusCode.badRequest)
        .json(badRequestObject("Sensor Invalido"));
        return;
    }
    const url_query: any = req.query;
    const fecha_i = timeService.validateDTurlFormat(url_query.fhi, timeService.operacion.resta);
    const fecha_f = timeService.validateDTurlFormat(url_query.fhf, timeService.operacion.suma);
    getImgPathList(estacion, sensor, tipo, fecha_i, fecha_f).then(paths => {
        res.status(statusCode.ok)
        .json({
            status: statusCode.ok,
            count: paths.length,
            list: paths
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

media.get('/lastPhoto', (req, res) => {
    getLastPhoto().then(path => {
        res.status(statusCode.ok)
        .sendFile(path);
    }).catch((err: Error) => {
        res.status(statusCode.conflict)
        .json({
            status: statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
})

media.get('/graphs/:imgName', (req, res) => {
    const imgName: string = req.params.imgName;
    getImgPath2(imgName).then(path => {
        res.status(statusCode.ok)
        .sendFile(path);
    }).catch((err: Error) => {
        res.status(statusCode.conflict)
        .json({
            status: statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});

export default media;