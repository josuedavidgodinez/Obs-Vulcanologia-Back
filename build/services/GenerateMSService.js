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
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMiniseeds = void 0;
const timeService = __importStar(require("./TimeService"));
const io = __importStar(require("./FileService"));
const listaTablas_1 = require("../database/listaTablas");
const pythonService_1 = require("./pythonService");
const genMiniseeds = (tabla, fechaInicio, fechaFin) => __awaiter(void 0, void 0, void 0, function* () {
    const obspydata = yield io.getObsPyDataFolder();
    const ascii2miniseed = io.a2msFolder;
    const sd = timeService.date2QDate(fechaInicio);
    const ed = timeService.date2QDate(fechaFin);
    const table = listaTablas_1.listaEstaciones[tabla].toString();
    const miniseeds = yield pythonService_1.runPy('generateMiniSeed', [sd, ed, table, obspydata, ascii2miniseed]);
    //Cambiar a Base de datos cuando sea posible
    yield io.addReg(miniseeds);
    return miniseeds.map(a => String(a));
});
exports.genMiniseeds = genMiniseeds;
//# sourceMappingURL=GenerateMSService.js.map