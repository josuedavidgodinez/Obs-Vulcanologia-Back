import pool from "../database/db";
import { listaAtributos } from "../models/listaAtributos";

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
    query += listaAtributos.fecha + ', ';
    query += listaAtributos.infrasonido1 + ', ';
    query += listaAtributos.infrasonido2 + ', ';
    query += listaAtributos.infrasonido3 + ', ';
    query += listaAtributos.infrasonido4;
    query += ' FROM ' + tabla;
    query += ' WHERE ' + listaAtributos.fecha + ' >= ' + fechaInicio;
    query += ' AND ' + listaAtributos.fecha + ' <= ' + fechaFin;

    const query_result = await pool.query(query);
    const result: graphicDataFormat = {
        fechas: [],
        sensores: [
            { nombre: listaAtributos.infrasonido1, mediciones: [] },
            { nombre: listaAtributos.infrasonido2, mediciones: [] },
            { nombre: listaAtributos.infrasonido3, mediciones: [] },
            { nombre: listaAtributos.infrasonido4, mediciones: [] },
        ]
    };
    query_result.rows.forEach(element => {
        result.fechas.push(element[listaAtributos.fecha]);
        result.sensores[0].mediciones.push(element[listaAtributos.infrasonido1]);
        result.sensores[1].mediciones.push(element[listaAtributos.infrasonido2]);
        result.sensores[2].mediciones.push(element[listaAtributos.infrasonido3]);
        result.sensores[3].mediciones.push(element[listaAtributos.infrasonido4]);
    });
    return result;
}