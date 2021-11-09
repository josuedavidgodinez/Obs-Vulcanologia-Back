import * as timeService from "./TimeService";
import pool from "../database/db";
import { listaEstaciones } from "../database/listaTablas";
import * as io from "./FileService";
import { runPy } from "./pythonService";
import * as FileS from "./FileServiceDB"


/**
 * Funcion para generar las imagenes de Espectrograma a partir de los miniseed almacenados
 * @param sensor Sensor del cual se quiere obtener imagen
 * @param table Estacion de la cual se quiere obtener imagen
 * @param endDate Fecha final
 * @returns  Devuelve el path de la imagen
 */

export const generateImage = async(sensor: string,table: string, endDate: Date): Promise<string> => {
    // se setea el delay de 13 horas para las graficas del espectrograma
    const startDate = timeService.addHours(endDate, -13);
    const EndDate = timeService.addHours(endDate, -12.83333);
    console.log(startDate)
    console.log(EndDate)
    const sd = timeService.date2QDate(startDate);
    const ed = timeService.date2QDate(EndDate);

    //se obtiene el folder de imagenes
    const imgFolder = await io.getImageFolder();
    //se establece el nombre de la imagen
    const imgName = 'ieg' + timeService.date2number(startDate)
        + '_' +timeService.date2number(endDate) + '_' +table+ '_' +sensor+  '.png';

    //se leen los miniseed desde la base de datos para construir los plot en python
    const miniseedsdb: string[] = await FileS.ReadMiniSeeds(table,sensor,sd,ed);
    const text = miniseedsdb.reduce((a,b) => { return a + '\n' + b});
        console.log(text);
    //se genera archivo txt temporal con todos los miniseed
    const tempFile = await io.genTempFile(text);
    await io.writeFile(tempFile,text,false);
    // se ejecuta script de python enviandole la ruta
    //del txt con las rutas de todos los mini seed
    //fecha de inicio y fin , no. de sensor y de estacion
    const parametros = [ imgFolder + imgName, tempFile ,sd,ed,sensor,table]
    const imgPath = await runPy('CreateSpgImg', parametros);
        console.log(imgPath)
    const alias = "eg_"+table;
    //se inserta ruta de imagen en base de datos la cual se obtuvo a partir del script
    // en python
    await FileS.InsertImage(table,sensor,"eg",alias,imgPath[0],sd,ed)
    return imgPath[0];
}
