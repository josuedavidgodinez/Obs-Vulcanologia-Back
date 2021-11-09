import pool from "../database/db";
import { columnasImagenes, columnasSensores } from "../models/listaAtributos";
import { columnasminiSeeds } from "../models/listaAtributos";


/**
 *  Lee los miniseed en BD a partir de un filtro que se compone por los sigguientes parametros :
 * @param estacion Estacion donde se obtendran los datos
 * @param sensor Sensor del cual queremos obtener datos
 * @param fechaInicio Fecha a partir de donde queremos obtener datos
 * @param fechaFin Fecha hasta donde queremos obtener los datos
 * @returns Deevueleve las rutas de los miniseed en base de datos
 */
export const ReadMiniSeeds = async ( estacion: string,sensor: string,fechaInicio: string, fechaFin: string): Promise<string[]> => {
   //se setean las variables de inicio
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    let query = 'SELECT '
    query += columnasminiSeeds.path 
    query += ' FROM archivos_seed2' 
    query += ' WHERE (' + columnasminiSeeds.fechaInicial + ' >= ' + fechaInicio + '::timestamp - \'1s\'::INTERVAL';
    query += ' AND ' + columnasminiSeeds.fechaFinal +' <= ' + fechaFin + '::timestamp + \'1s\'::INTERVAL ' + ')';
    query += ' AND ' + columnasminiSeeds.estacion + " = '" +estacion+"'";
    query += ' AND ' + columnasminiSeeds.sensor + " = '" +sensor+"'";
    //se ejecuta el query
    console.log(query);
    const query_result = await pool.query(query);
    //se obtienen los resultados
    const seeds =  query_result.rows.map(
        (r) => {
            return r[columnasminiSeeds.path]
        }
    );    
    return seeds;
}

/**
 * Se insertan las rutas de las imagenes en BD estableciendo valores para su posible busqueda en un futuro
 * @param estacion estacion por la cual se buscara
 * @param sensor sensor por el cual se buscara
 * @param tipo el tipo hace referencia , si es espectrograma o 24hrs revisar
 * archivo que contiene el catalogo de tipos de imagen '../models/listaTipoMedia.ts'
 * @param alias alias unico que tendra la imagen
 * @param ruta_completa ruta completa donde esta almacenada la imagen
 * @param fechaInicio fecha de inicio dela imagen
 * @param fechaFin fecha fin de la imagen
 */
export const InsertImage = async (estacion:string,sensor:string,tipo:string,alias:string,ruta_completa:string, fechaInicio: string, fechaFin: string): Promise<string> =>{
       //se setean las variables de inicio
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    let query = 'INSERT INTO public.imagenes_obspy2('
    query += columnasImagenes.estacion + ', ';
    query += columnasImagenes.sensor + ', ';
    query += columnasImagenes.tipo + ', ';
    query += columnasImagenes.alias + ', ';
    query += columnasImagenes.path + ', ';
    query += columnasImagenes.fechaInicial + ', ';
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
    query += "now() )";    
    //se ejecuta el query
   await pool.query(query);
   return "ok";
   
   
    
}

