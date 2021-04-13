import express, { Request, Response, NextFunction } from "express";
const app = express();

const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const logger = require('morgan');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(logger('dev'));


import router from "./routes/index";
import accountRouter from "./routes/accountRouter";
import localRouter from "./routes/localRouter";
import companyRouter from './routes/companyRouter';
import announceRouter from './routes/announceRouter';
import beaconRouter from './routes/beaconRouter';
import vehicleRouter from './routes/vehicleRouter';
import workerRouter from './routes/workerRouter';
import cctvRouter from './routes/cctvRouter';
import scannerRouter from './routes/scannerRouter';
import weatherRouter from './routes/weatherRouter';

import digRouter from './routes/digRouter';
import processRouter from './routes/processRouter';

app.use("/api", router);
app.use("/api/account", accountRouter);
app.use("/api/local", localRouter);
app.use("/api/company", companyRouter);
app.use("/api/announce", announceRouter);
app.use("/api/beacon", beaconRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/worker", workerRouter);
app.use("/api/cctv", cctvRouter);
app.use("/api/scanner", scannerRouter);
app.use("/api/weather", weatherRouter);

app.use("/api/dig", digRouter);
app.use("/api/process", processRouter);


app.listen(port, ()=>{
  console.log(`express in running on ${port}`);
});