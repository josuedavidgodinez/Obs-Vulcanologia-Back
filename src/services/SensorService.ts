import pool from "../database/db";
import { columnasSensores } from "../models/listaAtributos";

interface graphicDataFormat{
    fechas: Date[],
    sensores: {
        nombre: string,
        mediciones: any[]
    }[]
}

const floor2Second = (date: Date) => {
    const newDate = new Date(date.getTime());
    newDate.setMilliseconds(0);
    return newDate;
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
    query += ' ORDER BY ' + columnasSensores.fecha

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
    if (myRows.length == 0) return result;
    let lastDate: Date = myRows[0].fecha;
    let repeticiones: number = 0;
    let sumas: number[] = [0,0,0,0];
    const promedios: {fecha: Date, sensores: number[]}[] = []
    myRows.forEach(row => {
        const rowSec = floor2Second(row.fecha);
        const ldSec = floor2Second(lastDate);
        if(rowSec.getTime() != ldSec.getTime()){
            const fecha = ldSec;
            const sensores = [];
            for (let index = 0; index < 4; index++) {
                sensores.push(Math.round(sumas[index] / repeticiones));
            }
            promedios.push({fecha, sensores});
            repeticiones = 0;
            sumas = [0,0,0,0];
        }
        for (let index = 0; index < 4; index++) {
            sumas[index] += row.sensores[index];
        }
        repeticiones++;
        lastDate = row.fecha;
    });
    if(repeticiones !=  0){
        const fecha = floor2Second(lastDate)
        const sensores = [];
        for (let index = 0; index < 4; index++) {
            sensores.push(Math.round(sumas[index] / repeticiones));
        }
        promedios.push({fecha, sensores});
        repeticiones = 0;
        sumas = [0,0,0,0];
    }
    promedios.forEach(element => {
        result.fechas.push(element.fecha);
        for (let index = 0; index < 4; index++) {
            result.sensores[index].mediciones.push(element.sensores[index]);
        }
    });
    return result;
}
