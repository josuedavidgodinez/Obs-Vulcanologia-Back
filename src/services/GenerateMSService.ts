import * as timeService from "./TimeService";
import * as io from "./FileService";
import { listaEstaciones } from "../database/listaTablas";
import { runPy } from "./pythonService";

export const genMiniseeds = async (tabla: string, fechaInicio: Date, fechaFin: Date): Promise<string[]> => {
    const obspydata = await io.getObsPyDataFolder();
    const ascii2miniseed = io.a2msFolder;

    const sd = timeService.date2QDate(fechaInicio);
    const ed = timeService.date2QDate(fechaFin);
    const table = listaEstaciones[tabla].toString();

    const miniseeds = await runPy(
        'generateMiniSeed',
        [sd, ed, table, obspydata, ascii2miniseed]
    );

    //Cambiar a Base de datos cuando sea posible
    await io.addReg(miniseeds);

    return miniseeds.map(a => String(a));
}