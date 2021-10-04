import * as timeService from "./TimeService";
import pool from "../database/db";
import { listaEstaciones } from "../database/listaTablas";
import * as io from "./FileService";
import { runPy } from "./pythonService";
import * as FileS from "./FileServiceDB"
export const generateImage = async(sensor: string,table: string, endDate: Date): Promise<string> => {
    const startDate = timeService.addHours(endDate, -24);
    const sd = timeService.date2QDate(startDate);
    const ed = timeService.date2QDate(endDate);

    const imgFolder = await io.getImageFolder();
    const imgName = 'i24H' + timeService.date2number(startDate)
        + '_' +timeService.date2number(endDate) + '.png';
   
    const miniseedsdb: string[] = await FileS.ReadMiniSeeds(table,sensor,sd,ed);
    const text = miniseedsdb.reduce((a,b) => { return a + '\n' + b});
    const tempFile = await io.genTempFile(text);

    const parametros = [ imgFolder + imgName, tempFile ]
    const imgPath = await runPy('create24Himg', parametros);

    const alias = "24Hrs_"+table+"_"+sensor+"_"+sd
    await FileS.InsertImage(table,sensor,"24Hrs",alias,imgPath[0],sd,ed)
    return imgPath[0];
}
