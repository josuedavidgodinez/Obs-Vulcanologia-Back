///Funciones a ejecutar de forma automatica
import { genMiniseeds } from "../services/GenerateMSService";
import { generateImage } from "../services/Generat24HimgService";
import * as Check from '../services/CheckService';
import { listaTipos } from "../models/listaTipoMedia";

const fi = new Date('2020-12-20T00:00:00-06:00');
const ff = new Date('2020-12-21T00:00:00-06:00');
var archivo_seed_ocupado = 0;

export function Test(): string {
    return "Test"
}

export async function GenerateMSeed(table: string) {
    if (await Check.DiferenciaHoraArchivo(table) && (archivo_seed_ocupado == 0)) {
        archivo_seed_ocupado = 1;
        genMiniseeds(table, fi, ff).then(miniseeds => {
            console.log(JSON.stringify(miniseeds));
            archivo_seed_ocupado = 0;
        }).catch((err: Error) => {
            console.log(err.message);
            archivo_seed_ocupado = 0;
        });
    }
}


export async function GetImage(sensor: string, table: string) {
    let date = new Date();    
    generateImage(sensor, table, date).then(imgPath => {
        console.log('File created at ', imgPath);
    }).catch((err: Error) => {
        console.log(err.message);
    });
}