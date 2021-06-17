const express = require('express');
const app = express();

var http = require("http").createServer(app);  //모듈사용
const path = require("path");
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const logger = require('morgan');

const port = process.env.PORT || 8085;
var http = require("http").createServer(app);  //모듈사용

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use('/upload', express.static('uploads'));

app.use(cookieParser());
app.use(logger('dev'));
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));


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
const alarmRouter = require("./routes/alarmRouter");

const digRouter = require("./routes/digRouter");
const processRouter = require("./routes/processRouter");
const bleRouter = require("./routes/bleRouter");
const envRouter = require("./routes/envRouter");

const monitorRouter = require("./routes/monitorRouter");
const portScanner = require('./routes/lib/portscanner/portscan');
const bleConfig = require('./routes/lib/bleConfig');

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
app.use("/api/alarm", alarmRouter);

app.use("/api/dig", digRouter);
app.use("/api/process", processRouter);
app.use("/api/ble", bleRouter);
app.use("/api/environment", envRouter);

app.use("/api/monitor", monitorRouter);

// app.use(bodyParser.json());
// app.use(bodyParser.json({ limit : "100mb" })); 
// app.use(bodyParser.urlencoded({ limit:"100mb", extended: false }));
// const io = require("socket.io")(http, {
//   cors: {
//     origin: '*',
//   }
// });         //모듈 사용


const io = require("socket.io")(http, {
  cors: {
    origin: '*',
  }
});         //모듈 사용

app.set('io', io);

io.on("connection", function (socket) {
  console.log("소켓 접속 완료");

  socket.on('disconnect', () => {
    console.log('User has disconnected');
    const socketId = socket.id;
    if(intervalId.hasOwnProperty(socketId)){
      clearInterval(intervalId[socketId]);
      delete intervalId[socketId];
    }
  });

  let intervalId = {};

  socket.on("getData", (data) => {
    socket.emit("getData", {
      scanner: portScanner.items || [],
      beacon: bleConfig.items || []
    });
    const socketId = socket.id;
    if (!intervalId.hasOwnProperty(socketId)) {
      intervalId[socketId] = setInterval(function () {
        socket.emit("getData", {
          scanner: portScanner.items,
          beacon: bleConfig.items
        });
      }, 5000);
    } else {
    }
  });

  socket.on("roomjoin", (userid) => {  //roomjoin 이벤트명으로 데이터받기 //socket.on
    // console.log(userid);
    // socket.join(userid);  
  });
  // socket.emit('receive', '성공하자!!!!!!!')             //userid로 방 만들기

  socket.on("alert", (touserid) => {  //alet 이벤트로 데이터 받기 
    // console.log(touserid)
    io.to(touserid).emit("heejewake", touserid);  //touserid: 클라이언트1이 보낸데이터"hwi"
  });                                             //heejewake이벤트: hwi 에게 메시지 hwi를 보낸다
});

http.listen(port, () => {
  console.log(`express in running on ${port}`);
});
