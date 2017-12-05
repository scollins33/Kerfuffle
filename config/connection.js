const mysql = require("mysql");

let connection;

// Make connection to Heroku
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}
else {
  connection = mysql.createConnection({
    port: 3306,
    host: "localhost",
    user: "root",
    password: null,
    database: "trivia_db"  
  });
}

// Make connection. to MySQL
connection.connect(function(err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
});

// Export connection.
module.exports = connection;