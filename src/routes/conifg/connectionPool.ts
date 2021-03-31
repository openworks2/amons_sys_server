const mysql = require("mysql");
import dbconfig from "./database";
const pool = mysql.createPool(dbconfig);

export default pool;

