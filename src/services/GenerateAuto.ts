///Funciones a ejecutar de forma automatica
import { genMiniseeds } from "../services/GenerateMSService";
import { generateImage } from "../services/Generat24HimgService";
import * as Check from '../services/CheckService';
import { listaTipos } from "../models/listaTipoMedia";
import * as Time from '../services/TimeService'

const fi = new Date('2021-09-24T05:00:00-06:00');
const ff = new Date('2021-09-24T06:00:00-06:00');
var archivo_seed_ocupado = 0;

export function Test(): string {
    return "Test"
}

export async function GenerateMSeed(table: string) {
    var fecha_inicial = new Date()
    var f_i = Time.addHours(Time.changeToUTC(fecha_inicial), -12);
    var f_f = Time.addHours(Time.changeToUTC(fecha_inicial), -11);

    genMiniseeds(table, fi, ff).then(miniseeds => {
        console.log(JSON.stringify(miniseeds));
    }).catch((err: Error) => {
        console.log(err.message);
    });
}


export async function GetImage(sensor: string, table: string) {
    let date = new Date();
    generateImage(sensor, table, date).then(imgPath => {
        console.log('File created at ', imgPath);
    }).catch((err: Error) => {
        console.log(err.message);
    });
}