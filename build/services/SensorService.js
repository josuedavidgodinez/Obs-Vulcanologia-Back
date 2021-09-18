"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSensors = void 0;
const db_1 = __importDefault(require("../database/db"));
const listaAtributos_1 = require("../models/listaAtributos");
const getSensors = (tabla, fechaInicio, fechaFin) => __awaiter(void 0, void 0, void 0, function* () {
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    let query = 'SELECT ';
    query += listaAtributos_1.columnasSensores.fecha + ', ';
    query += listaAtributos_1.columnasSensores.infrasonido1 + ', ';
    query += listaAtributos_1.columnasSensores.infrasonido2 + ', ';
    query += listaAtributos_1.columnasSensores.infrasonido3 + ', ';
    query += listaAtributos_1.columnasSensores.infrasonido4;
    query += ' FROM ' + tabla;
    query += ' WHERE ' + listaAtributos_1.columnasSensores.fecha + ' >= ' + fechaInicio;
    query += ' AND ' + listaAtributos_1.columnasSensores.fecha + ' <= ' + fechaFin;
    const query_result = yield db_1.default.query(query);
    const result = {
        fechas: [],
        sensores: [
            { nombre: listaAtributos_1.columnasSensores.infrasonido1, mediciones: [] },
            { nombre: listaAtributos_1.columnasSensores.infrasonido2, mediciones: [] },
            { nombre: listaAtributos_1.columnasSensores.infrasonido3, mediciones: [] },
            { nombre: listaAtributos_1.columnasSensores.infrasonido4, mediciones: [] },
        ]
    };
    query_result.rows.forEach(element => {
        result.fechas.push(element[listaAtributos_1.columnasSensores.fecha]);
        result.sensores[0].mediciones.push(element[listaAtributos_1.columnasSensores.infrasonido1]);
        result.sensores[1].mediciones.push(element[listaAtributos_1.columnasSensores.infrasonido2]);
        result.sensores[2].mediciones.push(element[listaAtributos_1.columnasSensores.infrasonido3]);
        result.sensores[3].mediciones.push(element[listaAtributos_1.columnasSensores.infrasonido4]);
    });
    return result;
});
exports.getSensors = getSensors;
//# sourceMappingURL=SensorService.js.map