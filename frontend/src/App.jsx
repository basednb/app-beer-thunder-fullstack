import { useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { createTask, deleteTask, fetchTasks, updateTask } from './api/tasksApi';
import './App.css';

const WAKE_UP_ATTEMPTS = 10;
const WAKE_UP_RETRY_MS = 5000;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setWaking(false);
    setError(null);

    for (let attempt = 1; attempt <= WAKE_UP_ATTEMPTS; attempt++) {
      try {
        const data = await fetchTasks();
        setTasks(data);
        setError(null);
        setWaking(false);
        setLoading(false);
        return;
      } catch (err) {
        if (attempt === WAKE_UP_ATTEMPTS) {
          setError('Não foi possível conectar ao servidor. O trovão está em silêncio ⚡');
          setWaking(false);
          setLoading(false);
          return;
        }
        setWaking(true);
        await new Promise((resolve) => setTimeout(resolve, WAKE_UP_RETRY_MS));
      }
    }
  }

  async function handleCreate({ titulo, prioridade }) {
    try {
      const created = await createTask({ titulo, prioridade });
      setTasks((prev) => [created, ...prev]);
      setError(null);
    } catch (err) {
      setError('Não foi possível salvar a tarefa. Tente novamente em instantes ⚡');
      throw err;
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await updateTask(task.id, { status_concluido: !task.status_concluido });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setError(null);
    } catch (err) {
      setError('Não foi possível atualizar a tarefa. Tente novamente em instantes ⚡');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Não foi possível remover a tarefa. Tente novamente em instantes ⚡');
    }
  }

  const filteredTasks = useMemo(() => {
    if (filter === 'pendentes') return tasks.filter((t) => !t.status_concluido);
    if (filter === 'concluidas') return tasks.filter((t) => t.status_concluido);
    return tasks;
  }, [tasks, filter]);

  const pendingCount = tasks.filter((t) => !t.status_concluido).length;

  return (
    <div className="app">
      <div className="lightning-bg" aria-hidden="true" />

      <header className="app__header">
        <h1 className="app__title">
          🍺 Beer <span className="app__title-accent">&amp;</span> Thunder ⚡
        </h1>
        <p className="app__subtitle">sua lista de tarefas com sabor e trovão</p>
      </header>

      <main className="app__main">
        <TaskForm onCreate={handleCreate} />

        <div className="app__toolbar">
          <div className="app__filters">
            <button
              className={`filter-btn ${filter === 'todas' ? 'is-active' : ''}`}
              onClick={() => setFilter('todas')}
            >
              Todas
            </button>
            <button
              className={`filter-btn ${filter === 'pendentes' ? 'is-active' : ''}`}
              onClick={() => setFilter('pendentes')}
            >
              Pendentes
            </button>
            <button
              className={`filter-btn ${filter === 'concluidas' ? 'is-active' : ''}`}
              onClick={() => setFilter('concluidas')}
            >
              Concluídas
            </button>
          </div>
          <span className="app__counter">{pendingCount} pendente(s)</span>
        </div>

        {loading && waking && (
          <p className="app__status">Acordando o servidor, isso pode levar até 1 minuto… ⚡</p>
        )}
        {loading && !waking && <p className="app__status">Carregando tempestade…</p>}
        {error && <p className="app__status app__status--error">{error}</p>}

        {!loading && !error && (
          <TaskList tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </main>

      <footer className="app__footer">Beer &amp; Thunder — feito com ⚡ e alguns goles de coragem</footer>
    </div>
  );
}
