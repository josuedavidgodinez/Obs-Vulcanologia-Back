import { Router } from 'express';
import { listaImagenes, listaTablas } from "../database/listaTablas";
import { listaTipos } from "../models/listaTipoMedia";
import { getImgPath } from "../services/MediaService";
import * as timeService from "../services/TimeService";
import { statusCode } from "../models/statusCode";

const media: Router =  Router();

const badRequestObject = (message: string) => {
    return {
        message,
        status: statusCode.badRequest
    };
}

// host/media/estacion/sensor/tipo?fhi=_fechaHoraInicio&fhf=_fechaHoraFin
media.get('/:estacion/:sensor/:tipo', (req,  res) => {    
    const estacion: string = listaImagenes[req.params.estacion];
    const sensor: number = +req.params.sensor;
    const tipo: string = listaTipos[req.params.tipo];
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
    if(!tipo) {
        res.status(statusCode.badRequest)
        .json(badRequestObject("Tipo Invalido"));
        return;
    }
    const url_query: any = req.query;
    const fecha_i = timeService.validateDTurlFormat(url_query.fhi);
    const fecha_f = timeService.validateDTurlFormat(url_query.fhf);
    
    getImgPath(estacion, sensor, tipo, fecha_i, fecha_f).then(path => {
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