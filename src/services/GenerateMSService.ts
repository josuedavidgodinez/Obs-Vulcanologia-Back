import * as timeService from "./TimeService";
import * as io from "./FileService";
import pool from "../database/db";
import { listaTablas, listaEstaciones } from "../database/listaTablas";
import { runPy } from "./pythonService";

interface rowObject{
    ruta_completa: string,
    fecha_inicial: string,
    fecha_final: string,
    alias: string,
    estacion: string,
    sensor: string
    archivo_txt: string,
}

export const genMiniseeds = async (tabla: string, fechaInicio: Date, fechaFin: Date): Promise<string[]> => {
    const obspydata = await io.getObsPyDataFolder();
    const ascii2miniseed = io.a2msFolder;

    const sd = timeService.date2QDate(fechaInicio);
    const ed = timeService.date2QDate(fechaFin);
    const table = listaEstaciones[tabla].toString();

    const miniseeds = await runPy(
        'generateMiniSeed',
        [sd, ed, table, obspydata, ascii2miniseed]
    );

    const tempFile: string = miniseeds[miniseeds.length - 1];
    const text: string = await io.readFile(tempFile);
    const registers: string[] = text.split('\n');
    const msPaths: string[] = [];
    let sqlText: string = 'INSERT INTO ' + listaTablas['seeds'];
    sqlText += '(ruta_completa, fecha_inicial, fecha_final, alias, archivo_txt, fecha_hora_registro, estacion, sensor) VALUES ';
    for (let i = 0; i < registers.length; i++) {
        const reg = registers[i].split('\t');
        msPaths.push(reg[0]);
        for (let j = 0; j < reg.length; j++) {
            const item = reg[j];
            const prefix = i==0?'(':',';
            sqlText += prefix + ' ' + item;
        }
        sqlText += ')'
        if (i != registers.length - 1) sqlText += ',';
    }
    const query_result = await pool.query(sqlText);
    if(query_result.rowCount != registers.length) throw new Error('RowCount Inconsistency');
    return msPaths;
}