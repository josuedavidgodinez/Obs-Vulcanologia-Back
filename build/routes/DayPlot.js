"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const statusCode_1 = require("../models/statusCode");
const GenerateMSService_1 = require("../services/GenerateMSService");
const Generat24HimgService_1 = require("../services/Generat24HimgService");
const dayplot = express_1.Router();
const fi = new Date('2020-12-20T00:00:00-06:00');
const ff = new Date('2020-12-21T00:00:00-06:00');
// host/dayplot/genMiniseed
dayplot.get('/genMiniseed', (req, res) => {
    GenerateMSService_1.genMiniseeds('ise1', fi, ff).then(miniseeds => {
        res.status(statusCode_1.statusCode.ok)
            .json(miniseeds);
    }).catch((err) => {
        res.status(statusCode_1.statusCode.conflict)
            .json({
            status: statusCode_1.statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});
dayplot.get('/getImg', (req, res) => {
    Generat24HimgService_1.generateImage('ise1', ff).then(imgPath => {
        res.status(statusCode_1.statusCode.ok)
            .sendFile(imgPath);
    }).catch((err) => {
        res.status(statusCode_1.statusCode.conflict)
            .json({
            status: statusCode_1.statusCode.conflict,
            name: err.name,
            message: err.message
        });
    });
});
exports.default = dayplot;
//# sourceMappingURL=DayPlot.js.map