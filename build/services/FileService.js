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
exports.getImgPrueba = exports.getReg = exports.addReg = exports.a2msFolder = exports.getImageFolder = exports.getObsPyDataFolder = exports.getPyScript = exports.readFile = exports.writeFile = exports.fileExists = exports.createFolderIfNotExists = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dirchar = process.env.DIRCHAR ? process.env.DIRCHAR : '/';
const createFolderIfNotExists = (folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs.promises.access(folder);
        return false;
    }
    catch (_a) {
        yield fs.promises.mkdir(folder);
        return true;
    }
});
exports.createFolderIfNotExists = createFolderIfNotExists;
const fileExists = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield fs.promises.access(filePath);
        return true;
    }
    catch (_b) {
        return false;
    }
});
exports.fileExists = fileExists;
const writeFile = (path, text, append) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield exports.fileExists(path);
    if (exist && append)
        yield fs.promises.appendFile(path, text);
    else
        yield fs.promises.writeFile(path, text);
});
exports.writeFile = writeFile;
const rf = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data.toString());
        });
    });
};
const readFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const exist = yield exports.fileExists(path);
    if (!exist)
        throw new Error("File not exists");
    const content = yield rf(path);
    return content;
});
exports.readFile = readFile;
const getPyScript = (scriptname) => {
    return path.resolve('./src/pyscripts/' + scriptname + '.py');
};
exports.getPyScript = getPyScript;
const getObsPyDataFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    const folder = process.env.OBSPYDATA ? process.env.OBSPYDATA : '.' + dirchar + 'obspydata';
    const r = yield exports.createFolderIfNotExists(folder);
    if (r)
        console.log(folder + ' created');
    return folder;
});
exports.getObsPyDataFolder = getObsPyDataFolder;
const getImageFolder = () => __awaiter(void 0, void 0, void 0, function* () {
    const folder = process.env.IMGFOLDER ? process.env.IMGFOLDER : '.' + dirchar + 'obspydata';
    const r = yield exports.createFolderIfNotExists(folder);
    if (r)
        console.log(folder + ' created');
    return folder;
});
exports.getImageFolder = getImageFolder;
exports.a2msFolder = process.env.ATOMS ? process.env.ATOMS : '.' + dirchar + 'ascii2miniseed';
//Borrar cuando se cambie a base de datos
const miniseedRegs = () => __awaiter(void 0, void 0, void 0, function* () {
    const obspydata = yield exports.getObsPyDataFolder();
    return obspydata + 'listams.txt';
});
const addReg = (reg) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield miniseedRegs();
    let text = '';
    reg.forEach(element => {
        text += element + '\n';
    });
    yield exports.writeFile(file, text, true);
});
exports.addReg = addReg;
const getReg = () => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield miniseedRegs();
    const content = yield exports.readFile(file);
    return content.split('\n');
});
exports.getReg = getReg;
const getImgPrueba = () => {
    return path.resolve('./src/public/imagen_prueba.png');
};
exports.getImgPrueba = getImgPrueba;
//# sourceMappingURL=FileService.js.map