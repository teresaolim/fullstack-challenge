import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  // Fetch tasks from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/todos')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;

    axios
      .post('http://localhost:3000/todos', { description: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  // Toggle task state (complete/incomplete)
  const toggleTaskState = (id, currentState) => {
    axios
      .patch(`http://localhost:3000/todos/${id}`, {
        state: currentState === 'INCOMPLETE' ? 'COMPLETE' : 'INCOMPLETE',
      })
      .then((response) => {
        setTasks(
          tasks.map((task) => (task.id === id ? response.data : task))
        );
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id)); // Remove the task from the state
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h1>To-Do List</h1>

      {/* Add Task */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.state === 'COMPLETE'}
              onChange={() => toggleTaskState(task.id, task.state)}
            />
            <span>{task.description}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
