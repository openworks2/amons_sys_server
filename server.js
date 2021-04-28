const express = require('express');
const app = express();

const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const logger = require('morgan');

const port = process.env.PORT || 3000;

const router = require("./routes/index");
const accountRouter = require("./routes/accountRouter");
const localRouter = require("./routes/localRouter");
const companyRouter = require("./routes/companyRouter");
const announceRouter = require("./routes/announceRouter");
const beaconRouter = require("./routes/beaconRouter");
const vehicleRouter = require("./routes/vehicleRouter");
const workerRouter = require("./routes/workerRouter");
const cctvRouter = require("./routes/cctvRouter");
const scannerRouter = require("./routes/scannerRouter");
const weatherRouter = require("./routes/weatherRouter");

const digRouter = require("./routes/digRouter");
const processRouter = require("./routes/processRouter");

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

// app.use(bodyParser.json());
// app.use(bodyParser.json({ limit : "100mb" })); 
// app.use(bodyParser.urlencoded({ limit:"100mb", extended: false }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(logger('dev'));
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`express in running on ${port}`);
});
