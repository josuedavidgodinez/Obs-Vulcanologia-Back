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

/**
 * 
 * @param table Id de la estación de la cuál se va a generar mseeds
 */
export async function GenerateMSeed(table: string) {
    var fecha_inicial = new Date()  //Se obtiene la fecha
    var f_i = Time.addHours(Time.changeToUTC(fecha_inicial), -12);  //fecha inicial 12 hrs atrás
    var f_f = Time.addHours(Time.changeToUTC(fecha_inicial), -11);  //fecha final 11 hrs atrás

    /** 
     * table = id de la estación
     * f_i = fecha inicial
     * f_f = fecha final
    */
    genMiniseeds(table, f_i, f_f).then(miniseeds => {
        console.log(JSON.stringify(miniseeds));
    }).catch((err: Error) => {
        console.log(err.message);
    });
}

/**
 * Función que realiza la generación de imagenes de 24 hrs, cada 15 minutos con las tareas automáticas.
 * @param sensor número de sensor del cual se va a generar la imagen
 * @param table id de la estación que se va a generar la imagen
 * @param f_f fecha final de la cual se va a hacer la diferencia de las 24 hrs
 */
export async function GetImage(sensor: string, table: string,f_f: Date) {
  await  generateImage(sensor, table, f_f).then(imgPath => {
        console.log('File created at ', imgPath);
    }).catch((err: Error) => {
        console.log(err.message);
    });
}

/**
* Función que realiza la generación de imagenes de espectograma, cada 10 minutos con las tareas automáticas.
 * @param sensor número de sensor del cual se va a generar la imagen
 * @param table id de la estación que se va a generar la imagen
 * @param f_f fecha final de la cual se va a hacer la diferencia de las 24 hrs
 */
export async function GetImageSp(sensor: string, table: string,f_f: Date) {
   await generateImageSp(sensor, table, f_f).then(imgPath => {
        console.log('File Spectrogram created at ', imgPath);
    }).catch((err: Error) => {
        console.log(err.message);
    });
}

