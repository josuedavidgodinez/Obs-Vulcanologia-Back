  
import { Router } from 'express';
import pool  from '../database/db';
const medicion =  Router();


medicion.get('/', function(req,  res) {
   
    pool.query('select * from metrics',(err,data)=>{
        //pool.end()
        if(err){
        return res.status(500).json({ message : err});}
       
        return res.status(200).json(data);       
    })
});

export default medicion;