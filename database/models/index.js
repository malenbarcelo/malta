/*'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { localDB, remoteDB } = require('../config/sequelizeConfig'); //add to use 2 databases
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
} 

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;*/

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { localDB, remoteDB } = require('../config/sequelizeConfig');
const basename = path.basename(__filename);
const db = {};

// Función para inicializar todos los modelos con una instancia de Sequelize
const initializeModels = (sequelize, dbObject) => {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      dbObject[model.name] = model;
    });

  Object.keys(dbObject).forEach(modelName => {
    if (dbObject[modelName].associate) {
      dbObject[modelName].associate(dbObject);
    }
  });
};

// Inicializa los modelos con ambas bases de datos
const localModels = {};
const remoteModels = {};

initializeModels(new Sequelize(localDB), localModels);
initializeModels(new Sequelize(remoteDB), remoteModels);

db.local = localModels;
db.remote = remoteModels;
db.localDB = new Sequelize(localDB);
db.remoteDB = new Sequelize(remoteDB);
db.Sequelize = Sequelize;

module.exports = db;