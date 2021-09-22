import pool from "../database/db";
import { columnasImagenes, columnasSensores } from "../models/listaAtributos";
import { columnasminiSeeds } from "../models/listaAtributos";



export const ReadMiniSeeds = async ( fechaInicio: string, fechaFin: string): Promise<string[]> => {
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    let query = 'SELECT '
    query += columnasminiSeeds.path 
    query += ' FROM archivos_seed' 
    query += ' WHERE ' + columnasminiSeeds.fechaInicial + ' >= ' + fechaInicio;
    query += ' AND ' + columnasminiSeeds.fechaFinal + ' <= ' + fechaFin;
    const query_result = await pool.query(query);
    
    const seeds =  query_result.rows.map(
        (r) => {
            return r[columnasminiSeeds.path]
        }
    );
    
    return seeds;
}

export const InsertImage =  (estacion:string,sensor:string,tipo:string,alias:string,ruta_completa:string, fechaInicio: string, fechaFin: string,fechaHoraRegistro: string)=> {
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    fechaHoraRegistro  = "'" + fechaHoraRegistro + "'";
    let query = 'INSERT INTO public.imagenes_obspy2('
    query += columnasImagenes.estacion + ', ';
    query += columnasImagenes.sensor + ', ';
    query += columnasImagenes.tipo + ', ';
    query += columnasImagenes.alias + ', ';
    query += columnasImagenes.path + ', ';
    query += columnasImagenes.fechaFinal + ', ';
    query += columnasImagenes.fechaFinal + ', ';
    query += columnasImagenes.fechaRegisto + ')';
    query += ' VALUES (' 
    query += "'"+estacion+ "',";
    query += "'"+sensor+ "',";
    query += "'"+tipo+ "',";
    query += "'"+alias+ "',";
    query += "'"+ruta_completa+ "',";
    query += fechaInicio+ ",";
    query += fechaFin+ ",";
    query += fechaHoraRegistro+ ")";

   
    
     pool.query(query);
    
    
}

