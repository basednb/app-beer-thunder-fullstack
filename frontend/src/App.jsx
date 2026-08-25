import { useEffect, useMemo, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { createTask, deleteTask, fetchTasks, updateTask } from './api/tasksApi';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('todas');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Não foi possível conectar ao servidor. O trovão está em silêncio ⚡');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate({ titulo, prioridade }) {
    const created = await createTask({ titulo, prioridade });
    setTasks((prev) => [created, ...prev]);
  }

  async function handleToggle(task) {
    const updated = await updateTask(task.id, { status_concluido: !task.status_concluido });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
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

        {loading && <p className="app__status">Carregando tempestade…</p>}
        {error && <p className="app__status app__status--error">{error}</p>}

        {!loading && !error && (
          <TaskList tasks={filteredTasks} onToggle={handleToggle} onDelete={handleDelete} />
        )}
      </main>

      <footer className="app__footer">Beer &amp; Thunder — feito com ⚡ e alguns goles de coragem</footer>
    </div>
  );
}
