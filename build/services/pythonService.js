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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPy = void 0;
const io = __importStar(require("./FileService"));
const python_shell_1 = require("python-shell");
const runPy = (script, argumentos) => {
    const pyScript = io.getPyScript(script);
    return new Promise((resolve, reject) => {
        python_shell_1.PythonShell.run(pyScript, {
            pythonOptions: ['-u'],
            args: argumentos
        }, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            const r = res ? res : [];
            resolve(r);
        });
    });
};
exports.runPy = runPy;
//# sourceMappingURL=pythonService.js.map