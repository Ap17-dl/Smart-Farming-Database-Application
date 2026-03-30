import mysql from 'mysql2/promise';

let pool = null;

export async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'smart_farming',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function query(sql, values) {
  const dbPool = await getPool();
  const connection = await dbPool.getConnection();
  try {
    // Handle empty values array
    const params = (!values || values.length === 0) ? [] : values;
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

export async function execute(sql, values) {
  const dbPool = await getPool();
  const connection = await dbPool.getConnection();
  try {
    const [results] = await connection.execute(sql, values);
    return results;
  } finally {
    connection.release();
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
