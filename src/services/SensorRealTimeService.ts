import pool from "../database/db";
import { listaAtributos } from "../models/listaAtributos";

interface medicion {
    fecha: Date,
    infrasonido1: number | null,
    infrasonido2: number | null,
    infrasonido3: number | null,
    infrasonido4: number | null
}

interface graphicDataFormat {
    fechas: Date[],
    sensores: {
        nombre: string,
        mediciones: any[]
    }[]
}

export const getSensors = async (fechaInicio: string, fechaFin: string, localTime: boolean): Promise<graphicDataFormat> => {
    let tz = localTime ? '-06' : '+00';
    fechaInicio = "'" + fechaInicio + tz + "'";
    fechaFin = "'" + fechaFin + tz + "'";
    let query = 'SELECT '
    query += listaAtributos.fecha + ', ';
    query += listaAtributos.infrasonido1 + ', ';
    query += listaAtributos.infrasonido2 + ', ';
    query += listaAtributos.infrasonido3 + ', ';
    query += listaAtributos.infrasonido4;
    query += ' FROM mediciones';
    query += ' WHERE ' + listaAtributos.fecha + ' BETWEEN ' + fechaInicio;
    query += ' AND ' + fechaFin;

    const query_result = await pool.query(query);
    const rows: medicion[] = query_result.rows;
    const result: graphicDataFormat = {
        fechas: [],
        sensores: [
            { nombre: listaAtributos.infrasonido1, mediciones: [] },
            { nombre: listaAtributos.infrasonido2, mediciones: [] },
            { nombre: listaAtributos.infrasonido3, mediciones: [] },
            { nombre: listaAtributos.infrasonido4, mediciones: [] },
        ]
    };
    rows.forEach(element => {
        result.fechas.push(element.fecha);
        result.sensores[0].mediciones.push(element.infrasonido1);
        result.sensores[1].mediciones.push(element.infrasonido2);
        result.sensores[2].mediciones.push(element.infrasonido3);
        result.sensores[3].mediciones.push(element.infrasonido4);
    });
    return result;
}