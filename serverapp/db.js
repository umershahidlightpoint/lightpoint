const Sequelize = require("sequelize"),
  pg = require("pg");

const createDb = callback => {
  const dbName = "fund_db",
    username = "postgres",
    password = "postgres",
    host = "localhost";

  const conString =
    "postgres://" + username + ":" + password + "@" + host + "/postgres";
  const conStringPost =
    "postgres://" + username + ":" + password + "@" + host + "/" + dbName;

  // Connect to Postgres DB
  pg.connect(conString, function(err, client, done) {
    // Create the DB and Ignore any Errors, For Example if it Already Exists
    client.query("CREATE DATABASE " + dbName, function(err) {
      // DB should Exist Now, Initialize Sequelize
      const sequelize = new Sequelize(conStringPost);
      callback(sequelize);
      client.end(); // Close the Connection
    });
  });
};

createDb(connection => {
  console.log("Database Created");
});
