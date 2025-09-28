import { Router } from "express";

const router = Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await req.context.models.User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// GET a user by ID
router.get("/:userId", async (req, res) => {
  try {
    const user = await req.context.models.User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    // Validação básica
    if (!username || !email) {
      return res.status(400).json({ error: "Campos 'username' e 'email' são obrigatórios" });
    }

    const newUser = await req.context.models.User.create({ username, email });
    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      data: newUser,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// PUT to update a user by ID
router.put("/:userId", async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await req.context.models.User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await user.update({
      username: username ?? user.username,
      email: email ?? user.email,
    });

    return res.status(200).json({
      message: "Usuário atualizado com sucesso!",
      data: user,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// DELETE a user by ID
router.delete("/:userId", async (req, res) => {
  try {
    const result = await req.context.models.User.destroy({
      where: { id: req.params.userId },
    });

    if (result === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default router;
