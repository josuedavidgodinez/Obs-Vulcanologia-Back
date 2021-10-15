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
exports.genMiniseeds = void 0;
const timeService = __importStar(require("./TimeService"));
const io = __importStar(require("./FileService"));
const db_1 = __importDefault(require("../database/db"));
const listaTablas_1 = require("../database/listaTablas");
const pythonService_1 = require("./pythonService");
const genMiniseeds = (tabla, fechaInicio, fechaFin) => __awaiter(void 0, void 0, void 0, function* () {
    const obspydata = yield io.getObsPyDataFolder();
    const ascii2miniseed = io.a2msFolder;
    const temp = io.TEMPFolder;
    const sd = timeService.date2QDate(fechaInicio);
    console.log(sd);
    const ed = timeService.date2QDate(fechaFin);
    console.log(ed);
    const table = listaTablas_1.listaTablas[tabla].toString();
    const miniseeds = yield (0, pythonService_1.runPy)('generateMiniSeed', [sd, ed, table, obspydata, ascii2miniseed, temp]);
    const tempFile = miniseeds[miniseeds.length - 1];
    const text = yield io.readFile(tempFile);
    const registers = text.split('\n');
    const msPaths = [];
    let sqlText = 'INSERT INTO ' + listaTablas_1.listaTablas['seeds'];
    sqlText += '(ruta_completa, fecha_inicial, fecha_final, alias, estacion, sensor,archivo_txt,fecha_hora_registro) VALUES ';
    for (let i = 0; i < registers.length - 1; i++) {
        sqlText += '(';
        const reg = registers[i].split('\t');
        msPaths.push(reg[0]);
        for (let j = 0; j < reg.length; j++) {
            const item = reg[j];
            //const prefix = i==0?'(':',';           
            sqlText += '\'' + item + '\'';
            if (j != reg.length - 1)
                sqlText += ',';
        }
        sqlText += ',now())';
        if (i != registers.length - 2)
            sqlText += ',';
    }
    console.log(sqlText);
    const query_result = yield db_1.default.query(sqlText);
    console.log(query_result);
    if (query_result.rowCount != registers.length - 1)
        throw new Error('RowCount Inconsistency');
    return msPaths;
});
exports.genMiniseeds = genMiniseeds;
//# sourceMappingURL=GenerateMSService.js.map