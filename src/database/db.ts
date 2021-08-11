import { Pool } from 'pg';
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    user : process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT as string, 10)
});

export default pool;