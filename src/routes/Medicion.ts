  
import { Router } from 'express';
import pool  from '../database/db';
const medicion =  Router();


medicion.get('/', function(req,  res) {
   const fecha_i = req.body.fecha_i;
   const fecha_f = req.body.fecha_f;
   if(!fecha_i)
   return res.status(400).json({ message : "Error no se proporciono fecha_i"});
   
   if(!fecha_f)
   return res.status(400).json({ message : "Error no se proporciono fecha_f"});

   const query = "select * from metrics where tiempo between '" + fecha_i + "' and '" +fecha_f+"'" 
    pool.query(query,(err,data)=>{
        //pool.end()
        if(err){
        return res.status(500).json({ message : err});}
       
        return res.status(200).json(data.rows);       
    })
});

export default medicion;