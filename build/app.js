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
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
dotenv.config();
/**
 * ENV Variables
*/
// default values
if (!process.env.PORT) {
    process.env.PORT = "8080";
}
if (!process.env.DB_PORT) {
    process.env.DB_PORT = "5432";
}
let envVariables = 0;
// if (!process.env.variable){ envVariables++; console.log('variable missing in .env'); }
if (!process.env.DB_USER) {
    envVariables++;
    console.log('DB_USER missing in .env');
}
if (!process.env.HOST) {
    envVariables++;
    console.log('HOST missing in .env');
}
if (!process.env.DB) {
    envVariables++;
    console.log('DB missing in .env');
}
if (!process.env.DB_PASS) {
    envVariables++;
    console.log('DB_PASS missing in .env');
}
if (!process.env.ATOMS) {
    envVariables++;
    console.log('ATOMS missing in .env');
}
if (!process.env.OBSPYDATA) {
    envVariables++;
    console.log('OBSPYDATA missing in .env');
}
if (!process.env.IMGFOLDER) {
    envVariables++;
    console.log('IMGFOLDER missing in .env');
}
if (!process.env.TEMPFOLDER) {
    envVariables++;
    console.log('TEMPFOLDER missing in .env');
}
if (envVariables > 0)
    process.exit(1);
/**
 * Required Internal Modules
*/
const statusCode_1 = require("./models/statusCode");
const Medicion_1 = __importDefault(require("./routes/Medicion"));
const DayPlot_1 = __importDefault(require("./routes/DayPlot"));
const media_1 = __importDefault(require("./routes/media"));
const Seeds_1 = __importDefault(require("./routes/Seeds"));
const AutoTasks = __importStar(require("./services/GenerateAuto"));
/**
 * App Variables
*/
const cron = require('node-cron');
const PORT = parseInt(process.env.PORT, 10);
const app = (0, express_1.default)();
/**
 *  App Configuration
*/
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/med', Medicion_1.default); // site/med/
app.use('/dayplot', DayPlot_1.default); // site/dateplot
app.use('/media', media_1.default); // site/media
app.use('/see', Seeds_1.default); //pruebas de servicios de seeds e imagenes
app.get('/', (req, res) => {
    res.status(statusCode_1.statusCode.ok)
        .json({
        message: "API is listening",
        date: new Date()
    });
});
/**
 * Tareas automáticas
 * 1er * = minutos
 * 2do * = horas
 * 3er * = dia del mes
 * 4to * = mes
 * 5to * = dia de la semana
 */
//1
cron.schedule('0 */1 * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GenerateMSeed('ise1'));
    });
});
//2
cron.schedule('0 */1 * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GenerateMSeed('ise2'));
    });
});
//3
cron.schedule('0 */1 * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GenerateMSeed('e1ms1'));
    });
});
//24 HOURS PLOT
//1
cron.schedule('0 */15 * * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GetImage('1', 'e1ms1'));
        console.log(AutoTasks.GetImage('2', 'e1ms1'));
        console.log(AutoTasks.GetImage('3', 'e1ms1'));
        console.log(AutoTasks.GetImage('4', 'e1ms1'));
    });
});
//2
cron.schedule('0 */15 * * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GetImage('1', 'ise2'));
        console.log(AutoTasks.GetImage('2', 'ise2'));
        console.log(AutoTasks.GetImage('3', 'ise2'));
        console.log(AutoTasks.GetImage('4', 'ise2'));
    });
});
//3
cron.schedule("0 */15 * * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GetImage('1', 'ise1'));
        console.log(AutoTasks.GetImage('2', 'ise1'));
        console.log(AutoTasks.GetImage('3', 'ise1'));
        console.log(AutoTasks.GetImage('4', 'ise1'));
    });
});
//SPECTROGRAM PLOT
//1
cron.schedule('0 */15 * * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GetImageSp('1', 'e1ms1'));
        console.log(AutoTasks.GetImageSp('2', 'e1ms1'));
        console.log(AutoTasks.GetImageSp('3', 'e1ms1'));
        console.log(AutoTasks.GetImageSp('4', 'e1ms1'));
    });
});
//2
cron.schedule('0 */15 * * * *', function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GetImageSp('1', 'ise2'));
        console.log(AutoTasks.GetImageSp('2', 'ise2'));
        console.log(AutoTasks.GetImageSp('3', 'ise2'));
        console.log(AutoTasks.GetImageSp('4', 'ise2'));
    });
});
//3
cron.schedule("0 */15 * * * *", function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(AutoTasks.GetImageSp('1', 'ise1'));
        console.log(AutoTasks.GetImageSp('2', 'ise1'));
        console.log(AutoTasks.GetImageSp('3', 'ise1'));
        console.log(AutoTasks.GetImageSp('4', 'ise1'));
    });
});
/**
 * Server Activation
*/
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map