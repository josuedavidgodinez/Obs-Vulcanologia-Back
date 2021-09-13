import pool from "../database/db";
import { listaAtributos } from "../models/listaAtributos";
import * as io from "../services/FileService";

export const getImgPath = async (
    estacion: string,
    sensor: number,
    tipo: string,
    fechaInicio: string | null,
    fechaFin: string | null
): Promise<string> => {
    // TODO: query

    const imgPath = io.getImgPrueba();
    return imgPath;
}