"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listaTablas_1 = require("../database/listaTablas");
const listaTipoMedia_1 = require("../models/listaTipoMedia");
const MediaService_1 = require("../services/MediaService");
const timeService = __importStar(require("../services/TimeService"));
const statusCode_1 = require("../models/statusCode");
const media = express_1.Router();
const badRequestObject = (message) => {
    return {
        message,
        status: statusCode_1.statusCode.badRequest
    };
};
// host/media/estacion/sensor/tipo?fhi=_fechaHoraInicio&fhf=_fechaHoraFin
media.get('/:estacion/:sensor/:tipo', (req, res) => {
    const estacion = listaTablas_1.listaTablas[req.params.estacion];
    const sensor = +req.params.sensor;
    const tipo = listaTipoMedia_1.listaTipos[req.params.tipo];
    if (!estacion) {
        res.status(statusCode_1.statusCode.badRequest)
            .json(badRequestObject("Tabla Invalida"));
        return;
    }
    if (!Number.isInteger(sensor)) {
        res.status(statusCode_1.statusCode.badRequest)
            .json(badRequestObject("Sensor Invalido"));
        return;
    }
    if (sensor < 1 && sensor > 4) {
        res.status(statusCode_1.statusCode.badRequest)
            .json(badRequestObject("Sensor Invalido"));
        return;
    }
    if (!tipo) {
        res.status(statusCode_1.statusCode.badRequest)
            .json(badRequestObject("Tipo Invalido"));
        return;
    }
    const url_query = req.query;
    const fecha_i = timeService.validateDTurlFormat(url_query.fhi);
    const fecha_f = timeService.validateDTurlFormat(url_query.fhf);
    MediaService_1.getImgPath(estacion, sensor, tipo, fecha_i, fecha_f).then(path => {
        res.status(statusCode_1.statusCode.ok)
            .sendFile(path);
    }).catch((err) => {
        res.status(statusCode_1.statusCode.conflict)
            .json({
            status: statusCode_1.statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});
exports.default = media;
//# sourceMappingURL=media.js.map