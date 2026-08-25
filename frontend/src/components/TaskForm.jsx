import { useState } from 'react';
import { PRIORITY_LIST } from '../constants/priorities';

export default function TaskForm({ onCreate }) {
  const [titulo, setTitulo] = useState('');
  const [prioridade, setPrioridade] = useState('media');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!titulo.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onCreate({ titulo: titulo.trim(), prioridade });
      setTitulo('');
      setPrioridade('media');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-form__input"
        placeholder="Qual a próxima missão?"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        maxLength={120}
      />

      <div className="task-form__priorities">
        {PRIORITY_LIST.map((p) => (
          <button
            type="button"
            key={p.value}
            className={`priority-pill priority-pill--${p.value} ${prioridade === p.value ? 'is-active' : ''}`}
            onClick={() => setPrioridade(p.value)}
            title={`${p.label} · ${p.beerLabel}`}
          >
            <span className="priority-pill__emoji">{p.emoji}</span>
            {p.label}
          </button>
        ))}
      </div>

      <button type="submit" className="task-form__submit" disabled={!titulo.trim() || submitting}>
        {submitting ? 'Invocando…' : '⚡ Adicionar tarefa'}
      </button>
    </form>
  );
}
