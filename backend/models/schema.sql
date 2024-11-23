import mysql from 'mysql2';

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',      
  password: 'Panthum#00700',
  database: 'contacts',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0       
});

const db = pool.promise(); 
export default db; 
