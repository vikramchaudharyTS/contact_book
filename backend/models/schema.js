import mysql from 'mysql2';

import dotenv from 'dotenv';

dotenv.config();

const connectionString = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = mysql.createPool(connectionString);
const db = pool.promise();

export default db;
