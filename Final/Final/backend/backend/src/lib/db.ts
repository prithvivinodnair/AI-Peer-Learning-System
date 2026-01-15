import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Vismaya@2008",        // add your password if set
  database: "store_db",
});
