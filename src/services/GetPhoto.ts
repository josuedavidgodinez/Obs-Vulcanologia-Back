import pool from "../database/dbFotos";
export const getLastPhoto = async(): Promise<string> => {
    const query = 'SELECT path FROM filecatalog ORDER BY fecha DESC LIMIT 1';
    const query_result = await pool.query(query);
    const imgPath = query_result.rows[0].path;
    return imgPath;
}