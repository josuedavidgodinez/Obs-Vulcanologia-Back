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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetImage = exports.GenerateMSedd = exports.Test = void 0;
///Funciones a ejecutar de forma automatica
const node_fetch_1 = require("node-fetch");
function Test() {
    return "Test";
}
exports.Test = Test;
function GenerateMSedd() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.fetch('http://localhost:8080/genMiniseed');
        const body = yield response.json();
        console.log('inside cron function ', body);
    });
}
exports.GenerateMSedd = GenerateMSedd;
function GetImage() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield node_fetch_1.fetch('http://localhost:8080/getImg');
        const body = yield response.json();
        console.log('inside cron function ', body);
    });
}
exports.GetImage = GetImage;
//# sourceMappingURL=GenerateAuto.js.map