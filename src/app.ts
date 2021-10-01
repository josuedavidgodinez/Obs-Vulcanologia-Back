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
if (!process.env.DB_USER){ envVariables++; console.log('DB_USER missing in .env'); }
if (!process.env.HOST){ envVariables++; console.log('HOST missing in .env'); }
if (!process.env.DB){ envVariables++; console.log('DB missing in .env'); }
if (!process.env.DB_PASS){ envVariables++; console.log('DB_PASS missing in .env'); }
if (!process.env.ATOMS){ envVariables++; console.log('ATOMS missing in .env'); }
if (!process.env.OBSPYDATA){ envVariables++; console.log('OBSPYDATA missing in .env'); }
if (!process.env.IMGFOLDER){ envVariables++; console.log('IMGFOLDER missing in .env'); }
if (!process.env.TEMPFOLDER){ envVariables++; console.log('TEMPFOLDER missing in .env'); }
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
app.use('/dayplot', dayplot );// site/dateplot
app.use('/media', media); // site/media
app.use('/see',see); //pruebas de servicios de seeds e imagenes

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
cron.schedule('*/3 * * * *', async function () { 
    //console.log(AutoTasks.GenerateMSeed('ise1'))
});
//2
cron.schedule('*/4 * * * *', async function () { 
    //console.log(AutoTasks.GenerateMSeed('ise2'))
});
//3
cron.schedule('*/5 * * * *', async function () { 
    //console.log(AutoTasks.GenerateMSeed('e1ms1'))
});


//1
cron.schedule('*/15 * * * *', async function () { 
   // console.log(AutoTasks.GetImage('e1ms1'))
});
//2
cron.schedule('*/15 * * * *', async function () { 
   // console.log(AutoTasks.GetImage('ise2'))
});
//3
cron.schedule("*/15 * * * *", async function() {
    //AutoTasks.GetImage('ise1')
});


/**
 * Server Activation
*/

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});