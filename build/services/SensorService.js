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
const floor2Second = (date) => {
    const newDate = new Date(date.getTime());
    newDate.setMilliseconds(0);
    return newDate;
};
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
    query += ' ORDER BY ' + listaAtributos_1.columnasSensores.fecha;
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
    const myRows = query_result.rows.map(r => {
        return {
            fecha: r[listaAtributos_1.columnasSensores.fecha],
            sensores: [
                r[listaAtributos_1.columnasSensores.infrasonido1],
                r[listaAtributos_1.columnasSensores.infrasonido2],
                r[listaAtributos_1.columnasSensores.infrasonido3],
                r[listaAtributos_1.columnasSensores.infrasonido4],
            ]
        };
    });
    if (myRows.length == 0)
        return result;
    let lastDate = myRows[0].fecha;
    let repeticiones = 0;
    let sumas = [0, 0, 0, 0];
    const promedios = [];
    myRows.forEach(row => {
        const rowSec = floor2Second(row.fecha);
        const ldSec = floor2Second(lastDate);
        if (rowSec.getTime() != ldSec.getTime()) {
            const fecha = ldSec;
            const sensores = [];
            for (let index = 0; index < 4; index++) {
                sensores.push(Math.round(sumas[index] / repeticiones));
            }
            promedios.push({ fecha, sensores });
            repeticiones = 0;
            sumas = [0, 0, 0, 0];
        }
        for (let index = 0; index < 4; index++) {
            sumas[index] += row.sensores[index];
        }
        repeticiones++;
        lastDate = row.fecha;
    });
    if (repeticiones != 0) {
        const fecha = floor2Second(lastDate);
        const sensores = [];
        for (let index = 0; index < 4; index++) {
            sensores.push(Math.round(sumas[index] / repeticiones));
        }
        promedios.push({ fecha, sensores });
        repeticiones = 0;
        sumas = [0, 0, 0, 0];
    }
    promedios.forEach(element => {
        result.fechas.push(element.fecha);
        for (let index = 0; index < 4; index++) {
            result.sensores[index].mediciones.push(element.sensores[index]);
        }
    });
    return result;
});
exports.getSensors = getSensors;
//# sourceMappingURL=SensorService.js.map