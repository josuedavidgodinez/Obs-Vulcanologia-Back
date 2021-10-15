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
exports.generateImage = void 0;
const timeService = __importStar(require("./TimeService"));
const io = __importStar(require("./FileService"));
const pythonService_1 = require("./pythonService");
const FileS = __importStar(require("./FileServiceDB"));
const generateImage = (sensor, table, endDate) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = timeService.addHours(endDate, -24);
    const sd = timeService.date2QDate(startDate);
    const ed = timeService.date2QDate(endDate);
    const imgFolder = yield io.getImageFolder();
    const imgName = 'i24H' + timeService.date2number(startDate)
        + '_' + timeService.date2number(endDate) + '_' + table + '_' + sensor + '.png';
    const miniseedsdb = yield FileS.ReadMiniSeeds(table, sensor, sd, ed);
    const text = miniseedsdb.reduce((a, b) => { return a + '\n' + b; });
    console.log(text);
    const tempFile = yield io.genTempFile(text);
    yield io.writeFile(tempFile, text, false);
    const parametros = [imgFolder + imgName, tempFile];
    const imgPath = yield (0, pythonService_1.runPy)('create24Himg', parametros);
    console.log(imgPath);
    const alias = "24Hrs_" + table;
    yield FileS.InsertImage(table, sensor, "24Hrs", alias, imgPath[0], sd, ed);
    return imgPath[0];
});
exports.generateImage = generateImage;
//# sourceMappingURL=Generat24HimgService.js.map