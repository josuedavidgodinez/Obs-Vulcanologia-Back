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
if (envVariables > 0) process.exit(1);

/**
 * Required Internal Modules
*/

import { statusCode } from "./models/statusCode";
import medicion from "./routes/Medicion"

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

app.use('/med', medicion); // site/med/

app.get('/', (req, res) => {
    res.status(statusCode.ok)
      .json({message: "API is listening"});
});

/**
 * Server Activation
*/

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});