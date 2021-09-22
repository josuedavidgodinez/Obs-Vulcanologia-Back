import pool from "../database/db";
import { columnasImagenes } from "../models/listaAtributos";
import { columnasminiSeeds } from "../models/listaAtributos";

interface miniseedDataFormat{
    seeds: string[]
}

export const ReadMiniSeeds = async ( fechaInicio: string, fechaFin: string): Promise<miniseedDataFormat> => {
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    let query = 'SELECT '
    query += columnasminiSeeds.path 
    query += ' FROM archivos_seed' 
    query += ' WHERE ' + columnasminiSeeds.fechaInicial + ' >= ' + fechaInicio;
    query += ' AND ' + columnasminiSeeds.fechaFinal + ' <= ' + fechaFin;

    const query_result = await pool.query(query);
    let result: miniseedDataFormat = {
      seeds: []
    };
  const seeds =  query_result.rows.map(
       (r) => {
           return r[columnasminiSeeds.path]
       }
    );
    result = {seeds : seeds}
    
    return result;
}

