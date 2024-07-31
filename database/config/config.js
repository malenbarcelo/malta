const username = "maltachicwnpower_adm"
const password = "[832R(I~V=*f"
const database = "maltachicwnpower_db"

module.exports = 
  {
    "development": {
      "username": username,
      "password": password,
      "database": database,
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": username,
      "password": password,
      "database": database,
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": username,
      "password": password,
      "database": database,
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
}