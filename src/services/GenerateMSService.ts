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

/**
 * Funcion que genera miniseeds a partir de información leida en Postrgres
 * @param tabla Estacion o tabla de la cual se generaran miniseeds
 * @param fechaInicio desde que fecha de generaran miniseed
 * @param fechaFin    hasta que fecha se generaran miniseeds
 * @returns           Devuleve los path de los miniseeds
 */
export const genMiniseeds= async (tabla: string, fechaInicio: Date, fechaFin: Date): Promise<string[]> => {
    //obtiene paths de folder donde se guardaran miniseeds y la ruta
    //temporal donde se guardara el txt con todas las rutas
    const obspydata = await io.getObsPyDataFolder();
    const ascii2miniseed = io.a2msFolder;
    const temp = io.TEMPFolder
    //Se le da el formato correcto a las fechas
    const sd = timeService.date2QDate(fechaInicio);
    console.log(sd)
    const ed = timeService.date2QDate(fechaFin);
    console.log(ed)
    const table = listaTablas[tabla].toString();
    //Genera los miniseed con Python buscando en postgres la fecha inicio y fin
    //luego escribe las rutas de los miniseed en un txt temporal y devuleve la ruta del txt
    const miniseeds = await runPy(
        'generateMiniSeed',
        [sd, ed, table, obspydata, ascii2miniseed,temp]
    );
    //Se leen las rutas a partir del txt
    const tempFile: string = miniseeds[miniseeds.length - 1];
    const text: string = await io.readFile(tempFile);
    const registers: string[] = text.split('\n');    
    const msPaths: string[] = [];
    //Inserta todas las rutas de los miniseed en base de datos para que despues
    //puedan ser buscados a partir de las fechas para generar las imagenes de Espectrograma
    //y las de 24 horas que correspondan a esos grupos de fecha inicio y fin
    let sqlText: string = 'INSERT INTO ' + listaTablas['seeds'];
    sqlText += '(ruta_completa, fecha_inicial, fecha_final, alias, estacion, sensor,archivo_txt,fecha_hora_registro) VALUES ';
    for (let i = 0; i < registers.length-1; i++) {
        sqlText += '('
        const reg = registers[i].split('\t');
        msPaths.push(reg[0]);
        for (let j = 0; j < reg.length; j++) {
            const item = reg[j];
            //const prefix = i==0?'(':',';           
            sqlText += '\''+ item + '\'';
            if (j != reg.length - 1) sqlText += ',';
        }
        sqlText += ',now())'
        if (i != registers.length - 2) sqlText += ',';
    }
    console.log(sqlText)
    const query_result = await pool.query(sqlText);
    console.log(query_result)
    if(query_result.rowCount != registers.length-1) throw new Error('RowCount Inconsistency');
    //Devuelve las rutas de todos los miniseed
    return msPaths;
}