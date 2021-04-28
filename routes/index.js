const express = require("express");

const router = express.Router();
const upload = require('./lib/fileupload');
const multer = require('multer');


router.get("/", (req, res, next) => {
  console.log('get')
  res.send("world!!");
});

//Update sample
router.post("/upload", (req, res, next) => {
  // router.post("/upload", (req, res, next) => {
  // FormData의 경우 req로 부터 데이터를 얻을수 없다.
  // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다
  // console.log(req)
  // console.log('request--->',req)
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return next(err);
    } else if (err) {
      return next(err);
    }
    console.log('원본파일명 : ' + req.file.originalname)
    console.log('저장파일명 : ' + req.file.filename)
    console.log('크기 : ' + req.file.size)
    console.log(JSON.parse(req.body.reqBody));
    // console.log('경로 : ' + req.file.location) s3 업로드시 업로드 url을 가져옴
    return res.json({success:12312321});
  });
});

module.exports = router;