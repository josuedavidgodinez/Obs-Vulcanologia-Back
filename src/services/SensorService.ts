import pool from "../database/db";
import { columnasSensores } from "../models/listaAtributos";

interface graphicDataFormat{
    fechas: Date[],
    sensores: {
        nombre: string,
        mediciones: any[]
    }[]
}

const getUniqueDates = (dates: Date[]): Date[] => {
    const ud: Date[] = [];
    dates.forEach(d => {
        const check = ud.filter(u => u.getTime() == d.getTime());
        if(check.length == 0) ud.push(d);
    });
    return ud;
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
    const myRows: {fecha: Date, sensores: number[]}[] = query_result.rows.map(r => {
        return {
            fecha: r[columnasSensores.fecha],
            sensores: [
                r[columnasSensores.infrasonido1],
                r[columnasSensores.infrasonido2],
                r[columnasSensores.infrasonido3],
                r[columnasSensores.infrasonido4],
            ]
        };
    });
    const uniqueDates = getUniqueDates(myRows.map(r => r.fecha));
    const promedios: {fecha: Date, sensores: number[]}[] = uniqueDates.map(fecha => {
        const sensores: number[] = [];
        const dateRows = myRows.filter(r => r.fecha.getTime() == fecha.getTime());
        for (let index = 0; index < 4; index++) {
            const arr: number[] = dateRows.map(r => r.sensores[index]);
            const avg: number = Math.round(arr.reduce((a,b) => a + b, 0) / arr.length);
            sensores.push(avg);
        }
        return { fecha, sensores };
    });
    promedios.forEach(element => {
        result.fechas.push(element.fecha);
        for (let index = 0; index < 4; index++) {
            result.sensores[index].mediciones.push(element.sensores[index]);
        }
    });
    return result;
}