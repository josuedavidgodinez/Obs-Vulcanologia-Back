import * as timeService from "./TimeService";
import pool from "../database/db";
import { listaEstaciones } from "../database/listaTablas";
import * as io from "./FileService";
import { runPy } from "./pythonService";
import * as FileS from "./FileServiceDB"
export const generateImage = async(sensor: string,table: string, endDate: Date): Promise<string> => {
    const startDate = timeService.addHours(endDate, -13);
    const EndDate = timeService.addHours(endDate, -12);

    //const fi = new Date('2021-10-01T10:02:00-06:00');
    //const ff = new Date('2021-10-01T11:02:00-06:00');
    const sd = timeService.date2QDate(startDate);
    const ed = timeService.date2QDate(EndDate);

    const imgFolder = await io.getImageFolder();
    const imgName = 'ieg' + timeService.date2number(startDate)
        + '_' +timeService.date2number(endDate) + '_' +table+ '_' +sensor+  '.png';
    const miniseedsdb: string[] = await FileS.ReadMiniSeeds(table,sensor,sd,ed);
    const text = miniseedsdb.reduce((a,b) => { return a + '\n' + b});
        console.log(text);
    const tempFile = await io.genTempFile(text);
    await io.writeFile(tempFile,text,false);
    const parametros = [ imgFolder + imgName, tempFile ]
    const imgPath = await runPy('CreateSpgImg', parametros);
        console.log(imgPath)

    const alias = "eg_"+table;
    await FileS.InsertImage(table,sensor,"eg",alias,imgPath[0],sd,ed)
    return imgPath[0];
}
