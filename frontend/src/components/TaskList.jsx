import TaskCard from './TaskCard';

export default function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>Nenhuma tempestade por aqui ainda.</p>
        <p>Adicione a primeira tarefa e invoque o trovão ⚡</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
