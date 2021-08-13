import pool from "../database/db";
import { listaAtributos } from "../models/listaAtributos";

interface medicion{
    fecha: Date,
    infrasonido1: number | null,
    infrasonido2: number | null,
    infrasonido3: number | null,
    infrasonido4: number | null
}

interface graphicDataFormat{
    x: any[],
    y: any[]
}

export const getSensors = async (): Promise<graphicDataFormat> => {
    let query = 'SELECT '
    query+= listaAtributos.fecha + ', '
    query+= listaAtributos.infrasonido1 + ', '
    query+= listaAtributos.infrasonido2 + ', '
    query+= listaAtributos.infrasonido3 + ', '
    query+= listaAtributos.infrasonido4
    query+= ' FROM mediciones'

    const query_result = await pool.query(query);
    const rows: medicion[] = query_result.rows;
    const result: graphicDataFormat = {
        x: [],
        y: []
    };
    rows.forEach(element => {
        result.x.push(element.fecha);
        const obj: {[k: string]: any} = {};
        obj[listaAtributos.infrasonido1] = element.infrasonido1
        obj[listaAtributos.infrasonido2] = element.infrasonido2
        obj[listaAtributos.infrasonido3] = element.infrasonido3
        obj[listaAtributos.infrasonido4] = element.infrasonido4
        result.y.push(obj)
    });
    return result;
}