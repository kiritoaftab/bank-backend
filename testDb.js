import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: "4.187.155.7",
  user: "bank_user",
  password: "17ExMW7EEc9>",
  database: "xyz_bank",
});

console.log("Connected!");
