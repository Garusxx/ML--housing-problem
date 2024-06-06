import mysql from 'mysql2';
import './config.js';

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();


export async function getHausing() {
    const [rows] = await pool.query('SELECT * FROM house');
    return rows;

}

