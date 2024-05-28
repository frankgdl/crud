const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'vehicular_user',
    password: 'vehicular_password',
    database: 'vehicular_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

module.exports = db;
