import mysql from 'mysql2';

export const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pruebascanner'
})
DB.connect((err) => {
    if (err) {
        console.error('error connecting:', err);
        return;
    }
    console.log('conectado a la base de datos');
})