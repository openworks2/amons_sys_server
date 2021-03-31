"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zeroFill = require("zero-fill");
var indexCreateFn = function (code) {
    var dateSecond = new Date().getSeconds();
    var getSecond = dateSecond > 10 ? dateSecond : "0" + dateSecond;
    var _Random = String(Math.floor(Math.random() * 101));
    var fillNumber = zeroFill(3, _Random);
    var itemIndex = "" + code + fillNumber + getSecond;
    return itemIndex;
};
exports.default = indexCreateFn;
