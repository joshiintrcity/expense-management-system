require("dotenv").config();
const mysql = require("mysql2/promise");
(async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.LOCAL_DB_HOST,
      user: process.env.LOCAL_DB_USER,
      password: process.env.LOCAL_DB_PASSWORD,
      database: process.env.LOCAL_DB_NAME
    });
    const [rows] = await pool.query("SELECT id, type, amount, invoice_date, created_at FROM expenses ORDER BY id DESC LIMIT 10");
    console.log("DB_ROWS_START");
    console.log(JSON.stringify(rows, null, 2));
    console.log("DB_ROWS_END");
    process.exit(0);
  } catch(e) {
    console.error("DB Error:", e.message);
    process.exit(1);
  }
})();