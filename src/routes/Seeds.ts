import { Router } from 'express';
import { listaTablas } from "../database/listaTablas";
import { statusCode } from "../models/statusCode";
import * as FileService from "../services/FileServiceDB";
import * as timeService from "../services/TimeService";
const fil: Router =  Router();

// host/med/tabla?fhi=_fechaHoraInicio&fhf=_fechaHoraFin
fil.get('/', function(req,  res) {
  
    const url_query: any = req.query;
    // fechaHora = yyyyMMddHHmm
    const fecha_i = timeService.validateDTurlFormat(url_query.fhi);
    const fecha_f = timeService.validateDTurlFormat(url_query.fhf);
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
    FileService.ReadMiniSeeds(fecha_i, fecha_f).then(data => {
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



export default fil;