import mysql from 'mysql2';
import './config.js';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err.message);
        return;
    }
    console.log('Połączono z bazą danych');
    connection.release();
});

export async function getHousing() {
    const [rows] = await pool.query('SELECT * FROM house');
  
    const housingData = rows.map(row => ({
        ...row,
        metro_distance: parseFloat(row.metro_distance),
        center_distance: parseFloat(row.center_distance),
        price: parseFloat(row.price)
    }));
    return housingData;
}
