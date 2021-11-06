import pool from "../database/db";
import { listaTablas } from "../database/listaTablas";
import { columnasImagenes } from "../models/listaAtributos";

const getImgRef = (row: any) => {
    const path = row[columnasImagenes.path];
    const i = path.lastIndexOf('/');
    const j = path.lastIndexOf('\\');
    const k = i < 0?j:i;
    const imgName: string = path.substring(k + 1);
    const fechaInicial: string = row[columnasImagenes.fechaInicial];
    const fechaFinal: string = row[columnasImagenes.fechaFinal];
    return{ imgName, fechaInicial, fechaFinal };
}

export const getImgPath = async (
    estacion: string,
    sensor: number,
    tipo: string,
    fechaInicio: string | null
): Promise<string> => {
    fechaInicio = "'" + fechaInicio + "'";
    let query = 'SELECT '
    query += columnasImagenes.path
    query += ' FROM ' + listaTablas['imagenes'];
    query += ' WHERE ' + columnasImagenes.estacion + ' = ' + "'" +estacion+"'";
    query += ' AND ' + columnasImagenes.sensor + ' = ' + "'" +sensor+"'";
    query += ' AND ' + columnasImagenes.tipo + ' = ' + "'" +tipo+"'";
    query += ' AND ' + columnasImagenes.fechaInicial + ' <= ' + fechaInicio;
    query += ' AND ' + fechaInicio + ' <= ' + columnasImagenes.fechaFinal;
    query += ' ORDER BY ' + columnasImagenes.fechaFinal +' DESC';
    query += ' LIMIT 1';
    const query_result = await pool.query(query);
    if (query_result.rows.length == 0) throw new Error("Image Not Found");
    return query_result.rows[0][columnasImagenes.path];
}

//Obtener de base de datos las rutas de las imagenes de los plot realizados en python
export const getImgPathList = async (
    estacion: string,
    sensor: number,
    tipo: string,
    fechaInicio: string | null,
    fechaFin: string | null
): Promise<any[]> => {
    //Consulta de las rutas en BD dependiendo de la estacion y sensor
    let query = 'SELECT '
    query += columnasImagenes.path
    query += ',' + columnasImagenes.fechaInicial,
    query += ',' + columnasImagenes.fechaFinal
    query += ' FROM ' + listaTablas['imagenes'];
    query += ' WHERE ' + columnasImagenes.estacion + ' = ' + "'" +estacion+"'";
    query += ' AND ' + columnasImagenes.sensor + ' = ' + "'" +sensor+"'";
    query += ' AND ' + columnasImagenes.tipo + ' = ' + "'" +tipo+"'";
    if(fechaInicio && fechaFin){
        fechaInicio = "'" + fechaInicio + "'";
        query += ' AND ' + columnasImagenes.fechaInicial + ' >= ' + fechaInicio;
        fechaFin = "'" + fechaFin + "'";
        query += ' AND ' + columnasImagenes.fechaFinal + ' <= ' + fechaFin;
        query += ' ORDER BY ' + columnasImagenes.fechaRegisto +' DESC';
    }else if (!fechaInicio && !fechaFin)
        query += ' ORDER BY ' + columnasImagenes.fechaRegisto +' DESC LIMIT 10';
    else throw new Error("Invalid count of parameters");
    // se espera resultado de la consulta
    const query_result = await pool.query(query);
    if (query_result.rows.length == 0) return [];
    return query_result.rows.map(r => getImgRef(r));
}

export const getImgPath2 = async (imgName: string): Promise<string> => {
    const comilla = "'";
    const wparam = comilla + "%" + imgName + comilla;
    let query = 'SELECT '
    query += columnasImagenes.path
    query += ' FROM ' + listaTablas['imagenes'];
    query += ' WHERE ' + columnasImagenes.path + ' LIKE ' + wparam;
    const query_result = await pool.query(query);
    if (query_result.rows.length == 0) throw new Error("Image Not Found");
    return query_result.rows[0][columnasImagenes.path];
}