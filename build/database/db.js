"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT, 10)
});
exports.default = pool;
//# sourceMappingURL=db.js.map