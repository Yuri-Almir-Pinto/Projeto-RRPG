const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.POSTGRES_URL != '') {
    sequelize = new Sequelize(process.env.POSTGRES_URL);
}
else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "mysql",
    });
}



sequelize.authenticate().then(function () {
    console.log("Conectado ao banco de dados com sucesso.");
}).catch(function (err) {
    console.log("Falha ao se conectar com o banco de dados: " + err);
})

module.exports = { sequelize, DataTypes, Model };