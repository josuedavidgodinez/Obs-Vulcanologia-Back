import * as io from "./FileService";
import { PythonShell } from "python-shell";

export const runPy = (script: string, argumentos: string[]): Promise<any[]> => {
    const pyScript = io.getPyScript(script);
    return new Promise((resolve,reject) => {
       PythonShell.run(
           pyScript
           ,{
                pythonOptions: ['-u'],
                args: argumentos
           },(err, res) => {
                if (err){
                    reject(err);
                    return;
                } 
                const r = res?res:[];
                resolve(r);
           }
       );
    });
}