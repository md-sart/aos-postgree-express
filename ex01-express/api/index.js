console.log("POSTGRES_URL =", process.env.POSTGRES_URL);

import "dotenv/config";
import cors from "cors";
import express from "express";

import models, { sequelize } from "./models/index.js";
import routes from "./routes/index.js";

const app = express();
app.set("trust proxy", true);

// Configuração de CORS
var corsOptions = {
  origin: ["http://example.com", "*"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Logging simples de cada requisição
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Injetando models e usuário "me" no context
app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByPk(1),
  };
  next();
});

// Rotas
app.use("/", routes.root);
app.use("/session", routes.session);
app.use("/users", routes.user);
app.use("/messages", routes.message);

const port = process.env.PORT ?? 3000;
const eraseDatabaseOnSync = process.env.ERASE_DATABASE === "true";

// Sincronização do banco e inicialização
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    await createUsersWithMessages();
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });
});

// Função para popular DB inicial
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "rwieruch",
      email: "rwieruch@email.com",
      messages: [
        { text: "Published the Road to learn React" },
        { text: "Published also the Road to learn Express + PostgreSQL" },
      ],
    },
    { include: [models.Message] }
  );

  await models.User.create(
    {
      username: "ddavids",
      email: "ddavids@email.com",
      messages: [
        { text: "Happy to release ..." },
        { text: "Published a complete ..." },
      ],
    },
    { include: [models.Message] }
  );
};
