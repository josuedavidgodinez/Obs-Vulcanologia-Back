import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import medicion from "./routes/Medicion"

dotenv.config();

/**
 * ENV Variables
*/

let envVariables = 0;
// if (!process.env.variable){ envVariables++; console.log('variable missing in .env'); }

if(envVariables > 0) process.exit(1);

// default PORT
if (!process.env.PORT) { process.env.PORT = "8080"; }

/**
 * Required Internal Modules
*/

// import { rutaRouter } from "./routes/ruta";

/**
 * App Variables
*/

const PORT = parseInt(process.env.PORT as string, 10);
const app = express();


/**
 *  App Configuration
*/

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/med', medicion);

app.get('/', (req, res) => {
    res
      .status(200)
      .json({message: "API is listening"});
})

/**
 * Server Activation
*/

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});