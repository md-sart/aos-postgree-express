
import Sequelize from "sequelize";

import getUserModel from "./user.js";
import getMessageModel from "./message.js";

// Conexão com PostgreSQL usando a URL do .env
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Necessário para NeonDB
    },
  },
  dialectModule: require("pg"),
  logging: false, // Opcional: ver logs SQL
});

// Inicializa os models
const models = {
  User: getUserModel(sequelize, Sequelize),
  Message: getMessageModel(sequelize, Sequelize),
};

// Configura associações se existirem
Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;
