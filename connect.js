const mysql = require('mysql');
let connection = mysql.createConnection({
    multipleStatements: true, // To make multiple mysql queries
    host: 'den1.mysql6.gear.host',
    user: 'plaisir',
    password: 'Ht33_oz8j_3z',
    dateStrings:true,
    database: 'plaisir'
});

module.exports = connection;