import pool from "../database/dbFotos";
/**
 * Promesa que consulta y obtiene la última foto del volcán para colocar en pantalla inicial.
 * @returns devuelve la ruta de la última imagen del volcán 
 */
export const getLastPhoto = async(): Promise<string> => {
    const c = "'";
    const name = c + 'final.jpg' + c;
    const query = 'SELECT path FROM filecatalog WHERE originalname = ' + name + ' ORDER BY fecha DESC LIMIT 1';
    const query_result = await pool.query(query);
    if(query_result.rowCount == 0) throw new Error("Image not found");
    const imgPath = query_result.rows[0].path;
    return imgPath;
}