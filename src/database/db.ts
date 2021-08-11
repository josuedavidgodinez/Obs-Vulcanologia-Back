import { Pool } from 'pg';
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    user : process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT == undefined ? "5432" : process.env.DB_PORT )

    
});

export default pool;