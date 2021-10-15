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
exports.GetImageSp = exports.GetImage = exports.GenerateMSeed = exports.Test = void 0;
///Funciones a ejecutar de forma automatica
const GenerateMSService_1 = require("../services/GenerateMSService");
const Generat24HimgService_1 = require("../services/Generat24HimgService");
const GeneratSpimgService_1 = require("../services/GeneratSpimgService");
const Time = __importStar(require("../services/TimeService"));
const fi = new Date('2021-10-01T10:02:00-06:00');
const ff = new Date('2021-10-01T11:02:00-06:00');
var archivo_seed_ocupado = 0;
function Test() {
    return "Test";
}
exports.Test = Test;
function GenerateMSeed(table) {
    return __awaiter(this, void 0, void 0, function* () {
        var fecha_inicial = new Date();
        var f_i = Time.addHours(Time.changeToUTC(fecha_inicial), -12);
        var f_f = Time.addHours(Time.changeToUTC(fecha_inicial), -11);
        (0, GenerateMSService_1.genMiniseeds)(table, f_i, f_f).then(miniseeds => {
            console.log(JSON.stringify(miniseeds));
        }).catch((err) => {
            console.log(err.message);
        });
    });
}
exports.GenerateMSeed = GenerateMSeed;
function GetImage(sensor, table) {
    return __awaiter(this, void 0, void 0, function* () {
        let date = new Date();
        var f_f = Time.addHours(Time.changeToUTC(date), -13);
        (0, Generat24HimgService_1.generateImage)(sensor, table, f_f).then(imgPath => {
            console.log('File created at ', imgPath);
        }).catch((err) => {
            console.log(err.message);
        });
    });
}
exports.GetImage = GetImage;
function GetImageSp(sensor, table) {
    return __awaiter(this, void 0, void 0, function* () {
        let date = new Date();
        var f_f = Time.addHours(Time.changeToUTC(date), -13);
        (0, GeneratSpimgService_1.generateImage)(sensor, table, f_f).then(imgPath => {
            console.log('File created at ', imgPath);
        }).catch((err) => {
            console.log(err.message);
        });
    });
}
exports.GetImageSp = GetImageSp;
//# sourceMappingURL=GenerateAuto.js.map