import { Router } from 'express';
import { statusCode } from "../models/statusCode";
import { genMiniseeds } from "../services/GenerateMSService";
import { generateImage } from "../services/Generat24HimgService";
const dayplot: Router =  Router();

const fi = new Date('2020-12-20T00:00:00-06:00');
const ff = new Date('2020-12-21T00:00:00-06:00');

// host/dayplot/genMiniseed
dayplot.get('/genMiniseed', (req,  res) => {    
    genMiniseeds('ise1',fi,ff).then(miniseeds => {
        res.status(statusCode.ok)
            .json(miniseeds);
    }).catch((err: Error) => {
        res.status(statusCode.conflict)
        .json({
            status: statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});
dayplot.get('/getImg', (req, res) => {
    generateImage('ise1', ff).then(imgPath => {
        res.status(statusCode.ok)
        .sendFile(imgPath);
    }).catch((err: Error) => {
        res.status(statusCode.conflict)
        .json({
            status: statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});

export default dayplot;