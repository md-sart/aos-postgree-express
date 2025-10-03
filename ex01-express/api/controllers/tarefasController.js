import Tarefa from "../models/Tarefa.js";

export const listarTarefas = (req, res) => {
  res.json(Tarefa.all());
};

export const criarTarefa = (req, res) => {
  const { descricao, concluida } = req.body;
  if (!descricao) {
    return res.status(400).json({ error: "Descrição é obrigatória" });
  }
  const tarefa = Tarefa.create(descricao, concluida);
  res.status(201).json(tarefa);
};

export const obterTarefa = (req, res) => {
  const tarefa = Tarefa.findById(req.params.objectId);
  if (!tarefa) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(tarefa);
};

export const atualizarTarefa = (req, res) => {
  const tarefa = Tarefa.update(req.params.objectId, req.body);
  if (!tarefa) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json(tarefa);
};

export const deletarTarefa = (req, res) => {
  const tarefa = Tarefa.delete(req.params.objectId);
  if (!tarefa) return res.status(404).json({ error: "Tarefa não encontrada" });
  res.json({ message: "Tarefa deletada com sucesso" });
};