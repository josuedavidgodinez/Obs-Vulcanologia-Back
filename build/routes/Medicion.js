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
const statusCode_1 = require("../models/statusCode");
const sensorService = __importStar(require("../services/SensorService"));
const timeService = __importStar(require("../services/TimeService"));
const med = (0, express_1.Router)();
// host/med/tabla?fhi=_fechaHoraInicio&fhf=_fechaHoraFin
med.get('/:tabla', function (req, res) {
    const tabla = listaTablas_1.listaTablas[req.params.tabla];
    if (!tabla) {
        res.status(statusCode_1.statusCode.badRequest)
            .json({
            message: "Tabla Invalida",
            status: statusCode_1.statusCode.badRequest
        });
        return;
    }
    const url_query = req.query;
    // fechaHora = yyyyMMddHHmm
    const fecha_i = timeService.validateDTurlFormat(url_query.fhi);
    const fecha_f = timeService.validateDTurlFormat(url_query.fhf);
    if (!fecha_i) {
        res.status(statusCode_1.statusCode.badRequest)
            .json({
            message: "Fecha de Inicio Invalida",
            status: statusCode_1.statusCode.badRequest
        });
        return;
    }
    if (!fecha_f) {
        res.status(statusCode_1.statusCode.badRequest)
            .json({
            message: "Fecha de Final Invalida",
            status: statusCode_1.statusCode.badRequest
        });
        return;
    }
    sensorService.getSensors(tabla, fecha_i, fecha_f).then(data => {
        res.status(statusCode_1.statusCode.ok)
            .json({
            status: statusCode_1.statusCode.ok,
            data
        });
    }).catch((err) => {
        res.status(statusCode_1.statusCode.conflict)
            .json({
            status: statusCode_1.statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});
med.get('/:tabla/LecturaInicio', function (req, res) {
    const tabla = listaTablas_1.listaTablas[req.params.tabla];
    if (!tabla) {
        res.status(statusCode_1.statusCode.badRequest)
            .json({
            message: "Tabla Invalida",
            status: statusCode_1.statusCode.badRequest
        });
        return;
    }
    const fecha_actual = new Date();
    const fecha_ayer = timeService.addHours(fecha_actual, -24);
    const fecha_compuesta_inicial = timeService.date2QDate(fecha_ayer);
    const fecha_compuesta_final = timeService.date2QDate(fecha_actual);
    sensorService.getSensors(tabla, fecha_compuesta_inicial, fecha_compuesta_final).then(data => {
        res.status(statusCode_1.statusCode.ok)
            .json({
            status: statusCode_1.statusCode.ok,
            data
        });
    }).catch((err) => {
        res.status(statusCode_1.statusCode.conflict)
            .json({
            status: statusCode_1.statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});
exports.default = med;
//# sourceMappingURL=Medicion.js.map