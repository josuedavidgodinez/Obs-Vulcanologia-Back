import { Router } from 'express';
import pool from '../database/db';
import { statusCode } from "../models/statusCode";
const med: Router =  Router();

// host/med?fecha_i=_fechaInicio&fecha_f=_fechaFin
med.get('/', function(req,  res) {
    const url_query: any = req.query;
    const fecha_i = url_query.fecha_i;
    const fecha_f = url_query.fecha_f;
    if (!fecha_i) {
        res.status(statusCode.badRequest)
        .json({
            message : "Error no se proporciono fecha_i",
            status: statusCode.badRequest
        });
        return;
    }  
    if (!fecha_f) {
        res.status(statusCode.badRequest)
        .json({
            message : "Error no se proporciono fecha_f",
            status: statusCode.badRequest
        });
        return;
    }
    const query = "select * from metrics where tiempo between '" + fecha_i + "' and '" +fecha_f+"'" 
    pool.query(query, (err,data) => {
        if (err) {
            res.status(statusCode.conflict)
            .json({
                message : err,
                status: statusCode.conflict
            })
            return;
        }
        res.status(statusCode.ok)
        .json({
            data: data.rows,
            status: statusCode.ok
        });
    });
});

export default med;