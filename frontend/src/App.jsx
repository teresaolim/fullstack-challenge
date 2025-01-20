import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [message, setMessage] = useState(''); // Feedback message
  const [editingTaskId, setEditingTaskId] = useState(null); // ID of the task being edited
  const [editDescription, setEditDescription] = useState(''); // New description for the task being edited
  const [hideCompleted, setHideCompleted] = useState(false); // Hide completed tasks

  // Fetch tasks from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/todos', {
        params: { filter, orderBy: sortBy },
      })
      .then((response) => setTasks(response.data))
      .catch((error) => setMessage('Error fetching tasks: ' + error.message));
  }, [filter, sortBy]);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) {
      setMessage('Task description cannot be empty.');
      return;
    }

    axios
      .post('http://localhost:3000/todos', { description: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
        setMessage('Task added successfully!');
      })
      .catch((error) => setMessage('Error adding task: ' + error.message));
  };

  // Toggle task state
  const toggleTaskState = (id, currentState) => {
    axios
      .patch(`http://localhost:3000/todos/${id}`, {
        state: currentState === 'INCOMPLETE' ? 'COMPLETE' : 'INCOMPLETE',
      })
      .then((response) => {
        setTasks(
          tasks.map((task) => (task.id === id ? response.data : task))
        );
        setMessage('Task updated successfully!');
      })
      .catch((error) => setMessage('Error updating task: ' + error.message));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
        setMessage('Task deleted successfully!');
      })
      .catch((error) => setMessage('Error deleting task: ' + error.message));
  };

  // Save edited task description
  const saveTask = (id) => {
    if (!editDescription.trim()) {
      setMessage('Task description cannot be empty.');
      return;
    }

    axios
      .patch(`http://localhost:3000/todos/${id}`, { description: editDescription })
      .then((response) => {
        setTasks(tasks.map((task) => (task.id === id ? response.data : task))); // Update the task list
        setEditingTaskId(null); // Exit editing mode
        setEditDescription(''); // Clear input
        setMessage('Task updated successfully!');
      })
      .catch((error) => setMessage('Error updating task: ' + error.message));
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditDescription('');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f1f1f1',
        fontFamily: "'Roboto', Arial, sans-serif",
        margin: '0', // Ensure no default margin
        padding: '0', // Ensure no default padding
        width: '100vw', // Take the full width of the viewport
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          padding: '20px',
          borderRadius: '12px', // Highlight: Slightly increased border radius
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)', // Highlight: More pronounced shadow for depth
          backgroundColor: '#fff',
          transition: 'transform 0.2s', // Highlight: Smooth scaling effect
        }}
      >
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', fontSize: '2rem' }}>
          To-Do List
        </h1>

      {/* Add Task */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          style={{
            padding: '12px',
            width: '70%',
            marginRight: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)', // Highlight: Inner shadow for depth
          }}
          aria-label="Task description input"
        />
        <button
          onClick={addTask}
          style={{
            padding: '12px 24px', // Highlight: Larger button padding
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #28a745, #218838)', // Highlight: Gradient for buttons
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.3s, transform 0.2s', // Highlight: Smooth hover transitions
          }}
          onMouseEnter={(e) => (e.target.style.background = '#218838')} // Highlight: Darker on hover
          onMouseLeave={(e) =>
            (e.target.style.background =
              'linear-gradient(90deg, #28a745, #218838)')
          }
        >
          Add Task
        </button>
      </div>

      {/* Filters and Sorting */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <label htmlFor="filter" style={{ marginRight: '10px', fontSize: '14px', color: '#555' }}>Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          >
            <option value="ALL">All</option>
            <option value="COMPLETE">Complete</option>
            <option value="INCOMPLETE">Incomplete</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" style={{ marginRight: '10px', fontSize: '14px', color: '#555' }}>Sort By:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
            }}
          >
            <option value="description">Description</option>
            <option value="createdAt">Created Date</option>
            <option value="completedAt">Completed Date</option>
          </select>
        </div>
      </div>

      {/* Feedback Message */}
      {message && (
          <p
            style={{
              color: 'red',
              textAlign: 'center',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            {message}
          </p>
      )}

      {/* Task List */}
      <h2
        onClick={() => {
          if (sortBy === 'createdAt') setSortBy('description'); // Alphabetical (A to Z)
          else if (sortBy === 'description') setSortBy('-description'); // Reverse alphabetical (Z to A)
          else setSortBy('createdAt'); // Default sorting
        }}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          color: sortBy === 'description' || sortBy === '-description' ? 'green' : 'blue',
          textAlign: 'center',
        }}
        aria-label="Click to change sorting mode"
      >
        Tasks {sortBy === 'description' ? '(A-Z)' : sortBy === '-description' ? '(Z-A)' : '(Default)'}
      </h2>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks
          .filter((task) => !hideCompleted || task.state !== 'COMPLETE') // Filter completed tasks
          .map((task) => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                borderBottom: '1px solid #ddd',
                fontSize: '14px',
                color: '#333',
                backgroundColor: '#f9f9f9', // Highlight: Subtle background for tasks
                borderRadius: '6px', // Highlight: Rounded task items
                marginBottom: '10px', // Highlight: Spacing between tasks
              }}
            >
              <div>
                <input
                  type="checkbox"
                  checked={task.state === 'COMPLETE'}
                  onChange={() => toggleTaskState(task.id, task.state)}
                  aria-label={`Mark task as ${task.state === 'COMPLETE' ? 'incomplete' : 'complete'}`}
                  style={{
                    width: '20px', // Highlight: Increased size of the checkbox
                    height: '20px', // Highlight: Increased size of the checkbox
                    border: '2px solid #007bff', // Highlight: Added distinct blue border
                    borderRadius: '4px', // Highlight: Slight rounding for better aesthetics
                    cursor: 'pointer', // Highlight: Added pointer cursor to indicate clickability
                  }}
                />
                {editingTaskId === task.id ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      style={{
                        marginLeft: '10px',
                        padding: '5px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                      }}
                    />
                    <button
                      onClick={() => saveTask(task.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '4px',
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span style={{ marginLeft: '10px' }}>{task.description}</span>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '4px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Delete task"
              >
                Delete
              </button>
              {editingTaskId !== task.id && (
                <button
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditDescription(task.description);
                  }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '4px',
                    backgroundColor: '#ffc107',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    marginLeft: '10px',
                  }}
                >
                  Edit
                </button>
              )}
            </li>
          ))}
      </ul>

      {/* Hide Completed Tasks */}
      <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '4px',
            color: '#333',
          }}
        >
        <label>
          <input
            type="checkbox"
            checked={hideCompleted}
            onChange={(e) => setHideCompleted(e.target.checked)}
            style={{
              width: '20px', // Highlight: Increased size of the checkbox
              height: '20px', // Highlight: Increased size of the checkbox
              border: '2px solid #007bff', // Highlight: Added distinct blue border
              borderRadius: '4px', // Highlight: Slight rounding for better aesthetics
              cursor: 'pointer', // Highlight: Added pointer cursor to indicate clickability
              marginRight: '10px', // Highlight: Added spacing for better alignment
            }}
          />
          Hide Completed
        </label>
      </div>
    </div>
  </div>
  );
}

export default App;
