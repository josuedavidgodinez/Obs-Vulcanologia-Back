import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

/**
 * ENV Variables
*/

// default values
if (!process.env.PORT) { process.env.PORT = "8080"; }
if (!process.env.DB_PORT) { process.env.DB_PORT = "5432"; }

let envVariables = 0;
// if (!process.env.variable){ envVariables++; console.log('variable missing in .env'); }
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
import see from "./routes/Seeds"
import * as AutoTasks from "./services/GenerateAuto";


/**
 * App Variables
*/
const cron = require('node-cron');
const PORT = parseInt(process.env.PORT as string, 10);
const app = express();


/**
 *  App Configuration
*/

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/med', medicion); // site/med/
app.use('/dayplot', dayplot);// site/dateplot
app.use('/media', media); // site/media
app.use('/see', see); //pruebas de servicios de seeds e imagenes

app.get('/', (req, res) => {
    res.status(statusCode.ok)
        .json({
            message: "API is listening",
            date: new Date()
        });
});


/**
 * Tareas automáticas
 * 1er * = minutos
 * 2do * = horas
 * 3er * = dia del mes
 * 4to * = mes
 * 5to * = dia de la semana
 */

//1
cron.schedule('0 */1 * * *', async function () {
    console.log(AutoTasks.GenerateMSeed('ise1'))
});
//2
cron.schedule('0 */1 * * *', async function () {
    console.log(AutoTasks.GenerateMSeed('ise2'))
});
//3
cron.schedule('0 */1 * * *', async function () {
    console.log(AutoTasks.GenerateMSeed('e1ms1'))
});


//Images Cron
//1

cron.schedule('0 */15 * * * *', async function () {
    await H24_e1ms1();
    await H24_ise1();
    await H24_ise2();
});

cron.schedule('0 */10 * * * *', async function () {
    await SP_e1ms1();
    await SP_ise1();
    await SP_ise2();
});

async function H24_e1ms1() {
    console.log(await AutoTasks.GetImage('1', 'e1ms1'))
    console.log(await AutoTasks.GetImage('2', 'e1ms1'))
    console.log(await AutoTasks.GetImage('3', 'e1ms1'))
    console.log(await AutoTasks.GetImage('4', 'e1ms1'))
}
async function H24_ise2() {
    console.log(await AutoTasks.GetImage('1', 'ise2'))
    console.log(await AutoTasks.GetImage('2', 'ise2'))
    console.log(await AutoTasks.GetImage('3', 'ise2'))
    console.log(await AutoTasks.GetImage('4', 'ise2'))
}
async function H24_ise1() {
    console.log(await AutoTasks.GetImage('1', 'ise1'))
    console.log(await AutoTasks.GetImage('2', 'ise1'))
    console.log(await AutoTasks.GetImage('3', 'ise1'))
    console.log(await AutoTasks.GetImage('4', 'ise1'))
}

async function SP_e1ms1() {
    console.log(await AutoTasks.GetImageSp('1', 'e1ms1'))
    console.log(await AutoTasks.GetImageSp('2', 'e1ms1'))
    console.log(await AutoTasks.GetImageSp('3', 'e1ms1'))
    console.log(await AutoTasks.GetImageSp('4', 'e1ms1'))
}
async function SP_ise1() {
    console.log(await AutoTasks.GetImageSp('1', 'ise1'))
    console.log(await AutoTasks.GetImageSp('2', 'ise1'))
    console.log(await AutoTasks.GetImageSp('3', 'ise1'))
    console.log(await AutoTasks.GetImageSp('4', 'ise1'))
}
async function SP_ise2() {
    console.log(await AutoTasks.GetImageSp('1', 'ise2'))
    console.log(await AutoTasks.GetImageSp('2', 'ise2'))
    console.log(await AutoTasks.GetImageSp('3', 'ise2'))
    console.log(await AutoTasks.GetImageSp('4', 'ise2'))
}
/**
 * Server Activation
*/

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});