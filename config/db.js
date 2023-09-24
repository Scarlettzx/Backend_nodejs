const { createPool } = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const pool = createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  dateStrings: ["DATETIME", "DATE"],
  connectionLimit: 10,
});

//! เชื่อมต่อกับฐานข้อมูล
pool.getConnection((err, connection) => {
  if (err) {
    console.error("ไม่สามารถเชื่อมต่อกับฐานข้อมูล:", err.message);
  } else {
    console.log("connecting database");
    connection.release();
  }
});
module.exports = pool;
