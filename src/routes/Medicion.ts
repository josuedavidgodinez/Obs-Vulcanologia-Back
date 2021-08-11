  
import express from 'express';
import { Router } from 'express';
const medicion =  Router();


medicion.get('/', function(req,  res) {
    return res.status(200).json("under construction");
});

export default medicion;