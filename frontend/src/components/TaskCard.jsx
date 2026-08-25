import { PRIORITIES } from '../constants/priorities';

export default function TaskCard({ task, onToggle, onDelete }) {
  const priority = PRIORITIES[task.prioridade] ?? PRIORITIES.media;

  return (
    <li
      className={`task-card task-card--${priority.value} ${task.status_concluido ? 'is-done' : ''}`}
      style={{ '--glow-color': priority.color }}
    >
      <button
        className="task-card__check"
        onClick={() => onToggle(task)}
        aria-label={task.status_concluido ? 'Marcar como pendente' : 'Marcar como concluída'}
      >
        {task.status_concluido ? '⚡' : ''}
      </button>

      <div className="task-card__body">
        <p className="task-card__title">{task.titulo}</p>
        <span className="task-card__priority" title={priority.beerLabel}>
          <span className="task-card__priority-emoji">{priority.emoji}</span>
          {priority.label} · {priority.beerLabel}
        </span>
      </div>

      <button className="task-card__delete" onClick={() => onDelete(task.id)} aria-label="Excluir tarefa">
        ✕
      </button>
    </li>
  );
}
