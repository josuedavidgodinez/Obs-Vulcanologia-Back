import * as io from "./FileService";
import { PythonShell } from "python-shell";

//Servicio para ejcutar scripts de Python desde consola de node
export const runPy = (script: string, argumentos: string[]): Promise<any[]> => {
    // se obtiene la ruta de python
    const pyScript = io.getPyScript(script);
    //se ejecuta scriptcon sus argumentos
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