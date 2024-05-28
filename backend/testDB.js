const db = require('./config/db');

db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
        console.error('Error executing query:', err);
    } else {
        console.log('The solution is: ', results[0].solution);
    }
    db.end();
});
