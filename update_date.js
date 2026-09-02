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
    // Update existing expense record to today's date (2026-08-30)
    await pool.query("UPDATE expenses SET invoice_date = '2026-08-30' WHERE id = 1");
    const [rows] = await pool.query("SELECT id, type, amount, DATE_FORMAT(invoice_date, '%Y-%m-%d') AS invoice_date, created_at FROM expenses");
    console.log("UPDATED_ROWS:", JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch(e) {
    console.error("DB Error:", e.message);
    process.exit(1);
  }
})();