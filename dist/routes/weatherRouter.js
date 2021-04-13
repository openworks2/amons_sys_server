"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var weatherAPI_1 = __importDefault(require("./lib/weatherAPI"));
var options = {};
weatherAPI_1.default.init(options);
router.get("/weathers", function (req, res, next) {
    var resBody = {
        location: weatherAPI_1.default.location,
        body: weatherAPI_1.default.body
    };
    res.status(202).json(resBody);
});
router.put("/weathers/:code", function (req, res, next) {
    var code = req.params.code;
    weatherAPI_1.default.changLocation(code);
    res.status(202).end();
});
exports.default = router;
