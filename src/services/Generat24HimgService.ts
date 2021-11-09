import * as timeService from "./TimeService";
import pool from "../database/db";
import { listaEstaciones } from "../database/listaTablas";
import * as io from "./FileService";
import { runPy } from "./pythonService";
import * as FileS from "./FileServiceDB"
/**
 * Función para crear imagenes 
 * @param sensor número de sensor de la estación de la cual se va a generar la imagen 
 * @param table id de la estación de la cual se va a generar imagen
 * @param endDate fecha final de la cual se va a restar la diferencia de horas
 * @returns 
 */
export const generateImage = async(sensor: string,table: string, endDate: Date): Promise<string> => {
    const startDate = timeService.addHours(endDate, -24);   //La hora de la cual se hace la resta para crear imagenes, puede cambiar según sea necesario.
    const sd = timeService.date2QDate(startDate);
    const ed = timeService.date2QDate(endDate);

    const imgFolder = await io.getImageFolder();
    const imgName = 'i24H' + timeService.date2number(startDate)
        + '_' +timeService.date2number(endDate) + '_' +table+ '_' +sensor+  '.png'; //Nombre de la imagen 
    const miniseedsdb: string[] = await FileS.ReadMiniSeeds(table,sensor,sd,ed);    //Obtiene los mseeds necesarios para crear la imagen
    const text = miniseedsdb.reduce((a,b) => { return a + '\n' + b});
        console.log(text);
    const tempFile = await io.genTempFile(text);
    await io.writeFile(tempFile,text,false);
    const parametros = [ imgFolder + imgName, tempFile ]
    const imgPath = await runPy('create24Himg', parametros);    //Obtener la ruta donde se creó el archivo de la imagen
        console.log(imgPath)

    const alias = "24Hrs_"+table;
    
    await FileS.InsertImage(table,sensor,"24Hrs",alias,imgPath[0],sd,ed)    //Inserción a la tabla table= Estación, sensor = número de sensor de la estación
                                                                            //Tipo de imagen, alias un identificador, imgPath = ruta de imagen, sd = start date
                                                                            // ed = end date
    return imgPath[0];
}
