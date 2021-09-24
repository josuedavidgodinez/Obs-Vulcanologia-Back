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

    const commonAlias = timeService.date2number(fechaFin) + '_' + tabla;
    const regs: rowObject[] = [];
    for (let index = 0; index < miniseeds.length; index++) {
        const element: string = miniseeds[index];
        const paths = ('' + element).split('\t');//[txt,ms]
        const s = index + 1;
        regs.push({
            ruta_completa: "'" + paths[1] + "'",
            fecha_inicial: "'" + sd + "'",
            fecha_final: "'" + ed + "'",
            archivo_txt: "'" + paths[0] + "'",
            alias: "'" + commonAlias + '_' + s + "'",
            estacion: tabla,
            sensor: "'" + s + "'"
        });
    }
    const registerDate = "'" + timeService.date2QDate(new Date()) + "'";
    let query = 'INSERT INTO ' + listaTablas['seeds'];
    query += '(ruta_completa, fecha_inicial, fecha_final, alias, archivo_txt, fecha_hora_registro, estacion, sensor) VALUES ';
    for (let index = 0; index < regs.length; index++) {
        const r = regs[index];
        if(index != 0) query += ',';
        let row = '(' + r.ruta_completa + ',' + r.fecha_inicial + ',' + r.fecha_final;
        row += ',' + r.alias + ',' + r.archivo_txt + ',' + registerDate;
        row += ',' + r.estacion + ',' + r.sensor + ')';
        query += row;
    }
    const query_result = await pool.query(query);
    if(query_result.rowCount != regs.length) throw new Error('RowCount Inconsistency');
    return regs.map(r => r.ruta_completa);
}