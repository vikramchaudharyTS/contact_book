import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      
  password: 'Panthum#00700',
  database: 'contact_book',
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0       
});

const db = pool.promise(); 

// // Use async function to await the query
// async function getContacts() {
//   try {
//     const [rows] = await db.query('SELECT * FROM users');
//     console.log(rows);
//   } catch (error) {
//     console.error('Error executing query:', error);
//   }
// }

// // Calling the function to fetch data
// getContacts();

export default db;
