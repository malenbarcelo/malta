const localDB = {
    username: "root",
    password: "30941767",
    database: "malta_db",
    host: "127.0.0.1",
    dialect: "mysql"
  };
  
  const remoteDB = {
    username: "root",
    password: "30941767",
    database: "malta_wp_db",
    host: "127.0.0.1",
    dialect: "mysql"
  };
  
  module.exports = {
    localDB,
    remoteDB,
    development: localDB,
    test: localDB,
    production: localDB,
    remote: remoteDB 
  };