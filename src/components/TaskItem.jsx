export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <label className="task-label">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <span className="task-text">{task.text}</span>
      </label>
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="削除"
      >
        ✕
      </button>
    </li>
  )
}
