const { Pool } = require('pg');
const dotenv = require("dotenv");
dotenv.config();

const {
  HOST, PORT, USER, PASSWORD, DATABASE
} = process.env;

console.log(HOST, PORT, USER, PASSWORD, DATABASE)
const pool = new Pool({
  host: HOST,
  port: PORT,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});


module.exports = pool