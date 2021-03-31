"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
var database_1 = __importDefault(require("./database"));
var pool = mysql.createPool(database_1.default);
exports.default = pool;
