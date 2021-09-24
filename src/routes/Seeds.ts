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
    const sensor = url_query.sensor
    const estacion =url_query.estacion;
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
    FileService.ReadMiniSeeds(estacion,sensor,fecha_i, fecha_f).then(data => {
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

// host/med/tabla?fhi=_fechaHoraInicio&fhf=_fechaHoraFin
fil.post('/', function(req,  res) {
   const body=req.body;
    const est= body.est;
    const sens = body.sens;
    const tip = body.tip;
    const alias = body.alias;
    const path = body.path;
    const fi = timeService.validateDTurlFormat(body.fi);
    const ff= timeService.validateDTurlFormat(body.ff);
  
    FileService.InsertImage(est,sens,tip,alias,path,fi!!,ff!!).then(mes => {
      
        res.status(statusCode.created)
        .json({
            status: statusCode.created
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