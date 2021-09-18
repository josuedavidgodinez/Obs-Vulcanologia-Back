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
exports.getImgPath = void 0;
const db_1 = __importDefault(require("../database/db"));
const listaTablas_1 = require("../database/listaTablas");
const listaAtributos_1 = require("../models/listaAtributos");
const io = __importStar(require("../services/FileService"));
const getImgPath = (estacion, sensor, tipo, fechaInicio, fechaFin) => __awaiter(void 0, void 0, void 0, function* () {
    const imgPath = io.getImgPrueba();
    return imgPath;
    let query = 'SELECT ';
    query += listaAtributos_1.columnasImagenes.path;
    query += ' FROM ' + listaTablas_1.listaTablas['imagenes'];
    query += ' WHERE ' + listaAtributos_1.columnasImagenes.estacion + ' = ' + estacion;
    query += ' AND ' + listaAtributos_1.columnasImagenes.sensor + ' = ' + sensor;
    query += ' AND ' + listaAtributos_1.columnasImagenes.tipo + ' = ' + tipo;
    if (fechaInicio) {
        fechaInicio = "'" + fechaInicio + "'";
        query += ' AND ' + listaAtributos_1.columnasImagenes.fechaInicial + ' >= ' + fechaInicio;
    }
    if (fechaFin) {
        fechaFin = "'" + fechaFin + "'";
        query += ' AND ' + listaAtributos_1.columnasImagenes.fechaFinal + ' <= ' + fechaFin;
    }
    const query_result = yield db_1.default.query(query);
    if (query_result.rows.length == 0)
        throw new Error("Image Not Found");
    return query_result.rows[0][listaAtributos_1.columnasImagenes.path];
});
exports.getImgPath = getImgPath;
//# sourceMappingURL=MediaService.js.map