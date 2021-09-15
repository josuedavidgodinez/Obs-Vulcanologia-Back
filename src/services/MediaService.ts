import pool from "../database/db";
import { listaTablas } from "../database/listaTablas";
import { columnasImagenes } from "../models/listaAtributos";
import * as io from "../services/FileService";

export const getImgPath = async (
    estacion: string,
    sensor: number,
    tipo: string,
    fechaInicio: string | null,
    fechaFin: string | null
): Promise<string> => {
    const imgPath = io.getImgPrueba();
    return imgPath;

    let query = 'SELECT '
    query += columnasImagenes.path
    query += ' FROM ' + listaTablas['imagenes'];
    query += ' WHERE ' + columnasImagenes.estacion + ' = ' + estacion;
    query += ' AND ' + columnasImagenes.sensor + ' = ' + sensor;
    query += ' AND ' + columnasImagenes.tipo + ' = ' + tipo;
    if (fechaInicio){
        fechaInicio = "'" + fechaInicio + "'";
        query += ' AND ' + columnasImagenes.fechaInicial + ' >= ' + fechaInicio;
    }
    if (fechaFin){
        fechaFin = "'" + fechaFin + "'";
        query += ' AND ' + columnasImagenes.fechaFinal + ' <= ' + fechaFin;
    }
    const query_result = await pool.query(query);
    if (query_result.rows.length == 0) throw new Error("Image Not Found");
    return query_result.rows[0][columnasImagenes.path];
}