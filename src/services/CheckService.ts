import pool from "../database/db";
import { columnasminiSeeds, columnasImagenes } from "../models/listaAtributos";

/**
 * Diferencia de hora de los archivos mini seed generados para saber si deben generarse más.
 * @param tabla Filtra los archivos mini seed según la tabla de las estaciones.
 * @returns 
 */
export async function DiferenciaHoraArchivo(tabla:string): Promise<boolean> {
    let query = 'SELECT '
    query += 'DATE_PART(\'day\',max(' + columnasminiSeeds.fechaFinal + ')::timestamp - current_date::timestamp) * 24 + '
    query += 'DATE_PART(\'hour\',max(' + columnasminiSeeds.fechaFinal + ')::timestamp - current_date::timestamp) diferencia'
    query += ' FROM archivos_seed2 '
    query += ' WHERE estacion = ' + "'" + tabla + "'"
    const query_result = await pool.query(query);
    const diferencia_hora = query_result.rows[0].diferencia;

    if (diferencia_hora <= -1) {
        return true;
    }
    return false;
}

/**
 * Diferencia de hora de las imágenes generadas para saber si deben generarse más imágenes.
 * @param estacion Número de estación
 * @param sensor Nombre de sensor
 * @param tipo Tipo de imagen 
 * @returns 
 */
export async function DiferenciaHoraImagen(estacion: string, sensor: string, tipo: string): Promise<boolean> {
    let query = 'SELECT '
    query += 'DATE_PART(\'day\',max(' + columnasImagenes.fechaFinal + ')::timestamp - current_date::timestamp) * 24 + '
    query += 'DATE_PART(\'hour\',max(' + columnasImagenes.fechaFinal + ')::timestamp - current_date::timestamp) diferencia'
    query += ' FROM imagenes_obspy2'
    query += ' WHERE ' + columnasImagenes.estacion + '=' + "'" + estacion + "'"
    query += ' AND ' + columnasImagenes.sensor + '=' + "'" + sensor + "'"
    query += ' AND ' + columnasImagenes.tipo + '=' + "'" + tipo + "'"


    const query_result = await pool.query(query);
    const diferencia_hora = query_result.rows[0].diferencia;

    if (diferencia_hora <= -1) {
        return true;
    }
    return false;
}