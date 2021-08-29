import pool from "../database/db";
import { listaAtributos } from "../models/listaAtributos";

function generateHeader(name: string, samples:number, initDT: Date): string {
    const dtstring = initDT.toISOString().replace('Z','');
    return 'TIMESERIES '+ name +' '+samples + ' samples, 55 sps, ' + dtstring +', SLIST, INTEGER, Counts\r\n';
}
function genetateContent(meditions: number[]): string{
    const shortTab = '      ';
    const normalTab = '        ';
    const breakLine = '\r\n';
    let content = '';
    for (let index = 0; index < meditions.length; index++) {
        const element = meditions[index];
        if (index % 6 == 0){
            content += shortTab + element
        }
        else{
            content += normalTab + element;
            if(index % 6 == 5){
                content += breakLine;
            }
        }
    }
    return content;
}

export const getASCIIstrings = async (tabla: string, fechaInicio: string, fechaFin: string): Promise<string[]> => {
    fechaInicio = "'" + fechaInicio + "'";
    fechaFin = "'" + fechaFin + "'";
    let query = 'SELECT '
    query += listaAtributos.fecha + ', ';
    query += listaAtributos.infrasonido1 + ', ';
    query += listaAtributos.infrasonido2 + ', ';
    query += listaAtributos.infrasonido3 + ', ';
    query += listaAtributos.infrasonido4;
    query += ' FROM ' + tabla;
    query += ' WHERE ' + listaAtributos.fecha + ' >= ' + fechaInicio;
    query += ' AND ' + listaAtributos.fecha + ' <= ' + fechaFin;

    const query_result = await pool.query(query);
    const headData = [
        query_result.rows.length,
        query_result.rows[0][listaAtributos.fechaguardado]
    ];
    const infrasonido1 = generateHeader('GI_ISE2I_01_BDF_D',headData[0], headData[1])
        + genetateContent(query_result.rows.map(row => row[listaAtributos.infrasonido1]));
    const infrasonido2 = generateHeader('GI_ISE2I_02_BDF_D',headData[0], headData[1])
        + genetateContent(query_result.rows.map(row => row[listaAtributos.infrasonido2]));
    const infrasonido3 = generateHeader('GI_ISE2I_03_BDF_D',headData[0], headData[1])
        + genetateContent(query_result.rows.map(row => row[listaAtributos.infrasonido3]));
    const infrasonido4 = generateHeader('GI_ISE2I_04_BDF_D',headData[0], headData[1])
        + genetateContent(query_result.rows.map(row => row[listaAtributos.infrasonido4]));

    return [ infrasonido1, infrasonido2, infrasonido3, infrasonido4];
}