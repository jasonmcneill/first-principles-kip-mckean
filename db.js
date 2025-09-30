// db.js
const mysql = require("mysql2/promise");

// Create a pool for performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Mark an order as paid
async function markOrderPaid({ orderId, payerEmail, amount, currency }) {
  const sql = `
    INSERT INTO orders (order_id, payer_email, amount, currency, status)
    VALUES (?, ?, ?, ?, 'COMPLETED')
    ON DUPLICATE KEY UPDATE
      payer_email = VALUES(payer_email),
      amount = VALUES(amount),
      currency = VALUES(currency),
      status = 'COMPLETED'
  `;
  await pool.query(sql, [orderId, payerEmail, amount, currency]);
  console.log(`✅ Order ${orderId} marked as PAID`);
}

// Mark an order as failed
async function markOrderFailed({ orderId, reason }) {
  const sql = `
    INSERT INTO orders (order_id, status, failure_reason)
    VALUES (?, 'FAILED', ?)
    ON DUPLICATE KEY UPDATE
      status = 'FAILED',
      failure_reason = VALUES(failure_reason)
  `;
  await pool.query(sql, [orderId, reason]);
  console.log(`❌ Order ${orderId} marked as FAILED`);
}

module.exports = {
  markOrderPaid,
  markOrderFailed,
};

/*
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL UNIQUE,  -- PayPal's capture/order ID
  payer_email VARCHAR(255) DEFAULT NULL, -- Buyer’s email from PayPal
  amount DECIMAL(10,2) DEFAULT NULL,     -- Payment amount
  currency CHAR(3) DEFAULT NULL,         -- ISO currency code (e.g., USD, EUR)
  status ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  failure_reason VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
*/
