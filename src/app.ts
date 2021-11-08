import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as Time from '../src/services/TimeService'

dotenv.config();

/**
 * ENV Variables
*/

// default values
if (!process.env.PORT) { process.env.PORT = "8080"; }
if (!process.env.DB_PORT) { process.env.DB_PORT = "5432"; }
if (!process.env.RAIZ) { process.env.RAIZ = '/'; }

let envVariables = 0;
// if (!process.env.variable){ envVariables++; console.log('variable missing in .env'); }
if (!process.env.DB_FOTO) { envVariables++; console.log('DB_FOTO missing in .env'); }
if (!process.env.DB_USER) { envVariables++; console.log('DB_USER missing in .env'); }
if (!process.env.HOST) { envVariables++; console.log('HOST missing in .env'); }
if (!process.env.DB) { envVariables++; console.log('DB missing in .env'); }
if (!process.env.DB_PASS) { envVariables++; console.log('DB_PASS missing in .env'); }
if (!process.env.ATOMS) { envVariables++; console.log('ATOMS missing in .env'); }
if (!process.env.OBSPYDATA) { envVariables++; console.log('OBSPYDATA missing in .env'); }
if (!process.env.IMGFOLDER) { envVariables++; console.log('IMGFOLDER missing in .env'); }
if (!process.env.TEMPFOLDER) { envVariables++; console.log('TEMPFOLDER missing in .env'); }
if (envVariables > 0) process.exit(1);

/**
 * Required Internal Modules
*/

import { statusCode } from "./models/statusCode";
import medicion from "./routes/Medicion"
import dayplot from "./routes/DayPlot";
import media from "./routes/media";
import * as AutoTasks from "./services/GenerateAuto";


/**
 * App Variables
*/
const cron = require('node-cron');
const PORT = parseInt(process.env.PORT as string, 10);
const RAIZ = process.env.RAIZ;
const app = express();

/**
 *  App Configuration
*/

const myCors = cors({
    origin: '*',
    methods: ['GET','POST']
})

app.use(helmet());
app.use(myCors);
app.use(express.json());

app.use(RAIZ + 'med', myCors, medicion); // site/med/
app.use(RAIZ + 'dayplot', myCors, dayplot);// site/dateplot
app.use(RAIZ + 'media', myCors, media); // site/media

app.get(RAIZ, (req, res) => {
    res.status(statusCode.ok)
        .json({
            message: "API is listening",
            date: new Date()
        });
});


// /**
//  * Tareas automáticas con la librería cron 
//  * Significado de cada "*" de izquiera a derecha
//      1er * = minutos
//      2do * = horas
//      3er * = dia del mes
//      4to * = mes
//      5to * = dia de la semana
//  */
     
// //1
// /** 
//  * Método que ejecuta la tarea de crear un mseed de la estación ise1 cada hora en punto.
//  * para una hora en específico basta con poner la hora en la posición correcta.
// */
// cron.schedule('0 */1 * * *', async function () {
//     console.log(AutoTasks.GenerateMSeed('ise1'))
// });
// //2
// /** 
//  * Método que ejecuta la tarea de crear un mseed de la estación ise2 cada hora en punto.
//  * para una hora en específico basta con poner la hora en la posición correcta.
// */
// cron.schedule('0 */1 * * *', async function () {
//     console.log(AutoTasks.GenerateMSeed('ise2'))
// });
// //3
// /** 
//  * Método que ejecuta la tarea de crear un mseed de la estación e1ms1 cada hora en punto.
//  * para una hora en específico basta con poner la hora en la posición correcta.
// */
// cron.schedule('0 */1 * * *', async function () {
//     console.log(AutoTasks.GenerateMSeed('e1ms1'))
// });


// //Images Cron
// //1
// /** 
//  * Método que ejecuta la tarea de crear una imagen cada 15 minutos.
//  * para una hora en específico basta con poner la hora en la posición correcta.
// */
// cron.schedule('0 */15 * * * *', async function () {
//     let date = new Date();
//     const f_f = Time.addHours(Time.changeToUTC(date), -13); //Obtener como fecha final 13hrs atrás por un tema de delay en los archivos mseed
//                                                             //Si necesita cambiar la hora de delay, únicamente indicar la cantidad de tiempo en hrs

//     //Ejecuciones asincronas para llevar un orden en las gráficas
//     //Misma hora para los 3
//     await H24_e1ms1(f_f);
//     await H24_ise1(f_f);
//     await H24_ise2(f_f);
// });

// cron.schedule('0 */10 * * * *', async function () {
//     let date = new Date();
//     const f_f = Time.addHours(Time.changeToUTC(date), -13); //Obtener como fecha final 13hrs atrás por un tema de delay en los archivos mseed
//     //Si necesita cambiar la hora de delay, únicamente indicar la cantidad de tiempo en hrs

//     //Ejecuciones asincronas para llevar un orden en las gráficas
//     //Misma hora para los 3

//     await SP_e1ms1(f_f);
//     await SP_ise1(f_f);
//     await SP_ise2(f_f);
// });

/**
 * Método para generar imagenes de e1ms1 4 sensores
 * @param fecha_final Fecha requerida para el delay de tiempo, y restar 24 Hrs a partir de la fecha indicada.
 */
async function H24_e1ms1(fecha_final:Date) {
    console.log(await AutoTasks.GetImage('1', 'e1ms1',fecha_final))
    console.log(await AutoTasks.GetImage('2', 'e1ms1',fecha_final))
    console.log(await AutoTasks.GetImage('3', 'e1ms1',fecha_final))
    console.log(await AutoTasks.GetImage('4', 'e1ms1',fecha_final))
}
/**
 * Método para generar imagenes de ise2 4 sensores
 * @param fecha_final Fecha requerida para el delay de tiempo, y restar 24 Hrs a partir de la fecha indicada.
 */
async function H24_ise2(fecha_final:Date) {
    console.log(await AutoTasks.GetImage('1', 'ise2',fecha_final))
    console.log(await AutoTasks.GetImage('2', 'ise2',fecha_final))
    console.log(await AutoTasks.GetImage('3', 'ise2',fecha_final))
    console.log(await AutoTasks.GetImage('4', 'ise2',fecha_final))
}
/**
 * Método para generar imagenes de ise1 4 sensores
 * @param fecha_final Fecha requerida para el delay de tiempo, y restar 24 Hrs a partir de la fecha indicada.
 */
async function H24_ise1(fecha_final:Date) {
    console.log(await AutoTasks.GetImage('1', 'ise1',fecha_final))
    console.log(await AutoTasks.GetImage('2', 'ise1',fecha_final))
    console.log(await AutoTasks.GetImage('3', 'ise1',fecha_final))
    console.log(await AutoTasks.GetImage('4', 'ise1',fecha_final))
}
/**
 * Método para generar imagenes de ise1 4 sensores
 * @param fecha_final Fecha requerida para el delay de tiempo, y obtener 10 minutos atrás a partir de la fecha indicada.
 */
async function SP_e1ms1(fecha_final:Date) {
    
    console.log(await AutoTasks.GetImageSp('1', 'e1ms1',fecha_final))
    console.log(await AutoTasks.GetImageSp('2', 'e1ms1',fecha_final))
    console.log(await AutoTasks.GetImageSp('3', 'e1ms1',fecha_final))
    console.log(await AutoTasks.GetImageSp('4', 'e1ms1',fecha_final))
}
/**
 * Método para generar imagenes de ise1 4 sensores
 * @param fecha_final Fecha requerida para el delay de tiempo, y obtener 10 minutos atrás a partir de la fecha indicada.
 */
async function SP_ise1(fecha_final:Date) {
    
    console.log(await AutoTasks.GetImageSp('1', 'ise1',fecha_final))
    console.log(await AutoTasks.GetImageSp('2', 'ise1',fecha_final))
    console.log(await AutoTasks.GetImageSp('3', 'ise1',fecha_final))
    console.log(await AutoTasks.GetImageSp('4', 'ise1',fecha_final))
}
/**
 * Método para generar imagenes de ise1 4 sensores
 * @param fecha_final Fecha requerida para el delay de tiempo, y obtener 10 minutos atrás a partir de la fecha indicada.
 */
async function SP_ise2(fecha_final:Date) {
    
    console.log(await AutoTasks.GetImageSp('1', 'ise2',fecha_final ))
    console.log(await AutoTasks.GetImageSp('2', 'ise2',fecha_final))
    console.log(await AutoTasks.GetImageSp('3', 'ise2',fecha_final))
    console.log(await AutoTasks.GetImageSp('4', 'ise2',fecha_final))
}
/**
 * Server Activation
*/

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});