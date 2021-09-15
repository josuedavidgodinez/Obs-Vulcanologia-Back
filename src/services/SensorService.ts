import pool from "../database/db";
import { columnasSensores } from "../models/listaAtributos";

interface graphicDataFormat{
    fechas: Date[],
    sensores: {
        nombre: string,
        mediciones: any[]
    }[]
}

export const getSensors = async (tabla: string, fechaInicio: string, fechaFin: string): Promise<graphicDataFormat> => {
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    let query = 'SELECT '
    query += columnasSensores.fecha + ', ';
    query += columnasSensores.infrasonido1 + ', ';
    query += columnasSensores.infrasonido2 + ', ';
    query += columnasSensores.infrasonido3 + ', ';
    query += columnasSensores.infrasonido4;
    query += ' FROM ' + tabla;
    query += ' WHERE ' + columnasSensores.fecha + ' >= ' + fechaInicio;
    query += ' AND ' + columnasSensores.fecha + ' <= ' + fechaFin;

    const query_result = await pool.query(query);
    const result: graphicDataFormat = {
        fechas: [],
        sensores: [
            { nombre: columnasSensores.infrasonido1, mediciones: [] },
            { nombre: columnasSensores.infrasonido2, mediciones: [] },
            { nombre: columnasSensores.infrasonido3, mediciones: [] },
            { nombre: columnasSensores.infrasonido4, mediciones: [] },
        ]
    };
    query_result.rows.forEach(element => {
        result.fechas.push(element[columnasSensores.fecha]);
        result.sensores[0].mediciones.push(element[columnasSensores.infrasonido1]);
        result.sensores[1].mediciones.push(element[columnasSensores.infrasonido2]);
        result.sensores[2].mediciones.push(element[columnasSensores.infrasonido3]);
        result.sensores[3].mediciones.push(element[columnasSensores.infrasonido4]);
    });
    return result;
}