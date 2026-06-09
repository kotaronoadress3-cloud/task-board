import { useState } from 'react'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import './App.css'

export default function App() {
  const [tasks, setTasks] = useState([])

  function addTask(text) {
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ])
  }

  function toggleTask(id) {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  return (
    <div className="app">
      <h1>タスクボード</h1>
      <TaskInput onAdd={addTask} />
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  )
}
