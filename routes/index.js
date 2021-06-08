const express = require("express");

const router = express.Router();
const upload = require('./lib/fileupload');
const multer = require('multer');


router.get("/", (req, res, next) => {
  res.send("world!!");
});

//Update sample
router.post("/upload", (req, res, next) => {
  // router.post("/upload", (req, res, next) => {
  // FormData의 경우 req로 부터 데이터를 얻을수 없다.
  // upload 핸들러(multer)를 통해서 데이터를 읽을 수 있다

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return next(err);
    } else if (err) {
      return next(err);
    }
    return res.json({success:'success'});
  });
});

module.exports = router;