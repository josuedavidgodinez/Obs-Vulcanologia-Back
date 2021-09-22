import * as timeService from "./TimeService";
import pool from "../database/db";
import { listaEstaciones } from "../database/listaTablas";
import * as io from "./FileService";
import { runPy } from "./pythonService";

export const generateImage = async(table: string, endDate: Date): Promise<string> => {
    const startDate = timeService.addHours(endDate, -24);
    const sd = timeService.date2QDate(startDate);
    const ed = timeService.date2QDate(endDate);

    const imgFolder = await io.getImageFolder();
    const imgName = 'i24H' + timeService.date2number(startDate)
        + '_' +timeService.date2number(endDate) + '.png';

    // Cambiar a base de datos cuando sea posible
    const miniseeds: string[] = await io.getReg();
    //fecha inicio sea mayor o igual a la fecha que me estan mandando , fecha inicio menor o igual al end date


    const parametros = [ imgFolder + imgName ]
    miniseeds.forEach(element => parametros.push(element));
    
    const imgPath = await runPy(
        'create24Himg',
        parametros
    );

    //si img path retorna algo correcto lo inserto

    return imgPath[0];
}
