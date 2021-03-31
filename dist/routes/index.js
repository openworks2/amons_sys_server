"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get("/", function (req, res, next) {
    console.log('get');
    res.send("world!!");
});
module.exports = router;
