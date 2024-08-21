import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/tasks');
      setTasks(data);
    } catch (error) {
      setError('Error fetching tasks');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('/api/tasks', { ...newTask, status: 'To Do' });
      setTasks((prevTasks) => [...prevTasks, data]);
      setNewTask({ title: '', description: '' });
    } catch (error) {
      setError('Error creating task');
    }
    setLoading(false);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const draggedTask = tasks.find(task => task._id === result.draggableId);
    const updatedTasks = tasks.map(task =>
      task._id === draggedTask._id ? { ...task, status: destination.droppableId } : task
    );
    setTasks(updatedTasks);

    try {
      await axios.put(`/api/tasks/${draggedTask._id}`, { status: destination.droppableId });
    } catch (error) {
      setError('Error updating task status');
    }
  };

  const handleDelete = async (taskId) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
    } catch (error) {
      setError('Error deleting task');
    }
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading tasks...</p>}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {['To Do', 'In Progress', 'Done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                  <h2>{status}</h2>
                  {tasks.filter(task => task.status === status).map((task, index) => (
                    <Column key={task._id} task={task} index={index} onDelete={handleDelete} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
