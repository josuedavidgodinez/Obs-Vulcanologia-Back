///Funciones a ejecutar de forma automatica
import { genMiniseeds } from "../services/GenerateMSService";
import { generateImage } from "../services/Generat24HimgService";
import { generateImage as generateImageSp  } from "../services/GeneratSpimgService";

import * as Check from '../services/CheckService';
import { listaTipos } from "../models/listaTipoMedia";
import * as Time from '../services/TimeService'

const fi = new Date('2021-10-01T10:02:00-06:00');
const ff = new Date('2021-10-01T11:02:00-06:00');
var archivo_seed_ocupado = 0;

export function Test(): string {
    return "Test"
}

export async function GenerateMSeed(table: string) {
    var fecha_inicial = new Date()
    var f_i = Time.addHours(Time.changeToUTC(fecha_inicial), -12);
    var f_f = Time.addHours(Time.changeToUTC(fecha_inicial), -11);

    genMiniseeds(table, f_i, f_f).then(miniseeds => {
        console.log(JSON.stringify(miniseeds));
    }).catch((err: Error) => {
        console.log(err.message);
    });
}


export async function GetImage(sensor: string, table: string) {
    let date = new Date();
    var f_f = Time.addHours(Time.changeToUTC(date), -13);
  await  generateImage(sensor, table, f_f).then(imgPath => {
        console.log('File created at ', imgPath);
    }).catch((err: Error) => {
        console.log(err.message);
    });
}

export async function GetImageSp(sensor: string, table: string,f_f: Date) {
   await generateImageSp(sensor, table, f_f).then(imgPath => {
        console.log('File Spectrogram created at ', imgPath);
    }).catch((err: Error) => {
        console.log(err.message);
    });
}

