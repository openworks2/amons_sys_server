const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log('get')
  res.send("world!!");
});

module.exports = router;