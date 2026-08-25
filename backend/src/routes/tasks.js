const express = require('express');
const db = require('../db/database');

const router = express.Router();

const PRIORIDADES_VALIDAS = ['alta', 'media', 'baixa'];

function serializeTask(row) {
  return {
    id: row.id,
    titulo: row.titulo,
    prioridade: row.prioridade,
    status_concluido: Boolean(row.status_concluido),
    criado_em: row.criado_em,
  };
}

// GET /api/tasks - lista todas as tarefas
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM tasks ORDER BY status_concluido ASC, criado_em DESC').all();
  res.json(rows.map(serializeTask));
});

// POST /api/tasks - cria uma nova tarefa
router.post('/', (req, res) => {
  const { titulo, prioridade = 'media' } = req.body ?? {};

  if (typeof titulo !== 'string' || titulo.trim().length === 0) {
    return res.status(400).json({ error: 'O campo "titulo" é obrigatório.' });
  }
  if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ error: `O campo "prioridade" deve ser um de: ${PRIORIDADES_VALIDAS.join(', ')}.` });
  }

  const info = db
    .prepare('INSERT INTO tasks (titulo, prioridade, status_concluido) VALUES (?, ?, 0)')
    .run(titulo.trim(), prioridade);

  const created = db.prepare('SELECT * FROM tasks WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(serializeTask(created));
});

// PUT /api/tasks/:id - atualiza uma tarefa existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  const {
    titulo = existing.titulo,
    prioridade = existing.prioridade,
    status_concluido = Boolean(existing.status_concluido),
  } = req.body ?? {};

  if (typeof titulo !== 'string' || titulo.trim().length === 0) {
    return res.status(400).json({ error: 'O campo "titulo" é obrigatório.' });
  }
  if (!PRIORIDADES_VALIDAS.includes(prioridade)) {
    return res.status(400).json({ error: `O campo "prioridade" deve ser um de: ${PRIORIDADES_VALIDAS.join(', ')}.` });
  }

  db.prepare('UPDATE tasks SET titulo = ?, prioridade = ?, status_concluido = ? WHERE id = ?').run(
    titulo.trim(),
    prioridade,
    status_concluido ? 1 : 0,
    id
  );

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(serializeTask(updated));
});

// DELETE /api/tasks/:id - remove uma tarefa
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

  if (info.changes === 0) {
    return res.status(404).json({ error: 'Tarefa não encontrada.' });
  }

  res.status(204).send();
});

module.exports = router;
