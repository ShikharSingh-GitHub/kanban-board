import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';

const Board = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/tasks');
        if (Array.isArray(data)) {
          setTasks(data); // Ensure that `data` is an array before setting the tasks
        } else {
          setError('API did not return an array');
        }
      } catch (error) {
        setError('Error fetching tasks');
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      if (Array.isArray(tasks)) {
        setTasks(tasks.filter(task => task._id !== taskId)); // Only filter if `tasks` is an array
      } else {
        setError('Tasks data is not an array');
      }
    } catch (error) {
      setError('Error deleting task');
    }
    setLoading(false);
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const draggedTask = tasks.find(task => task._id === result.draggableId);
    if (!draggedTask) return;

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

  return (
    <div>
      <form>
        <input type="text" name="title" placeholder="Task Title" />
        <input type="text" name="description" placeholder="Task Description" />
        <button type="submit">Add Task</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          <Droppable droppableId="To Do">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>To Do</h2>
                {Array.isArray(tasks) && tasks.filter(task => task.status === 'To Do').map((task, index) => (
                  <Column key={task._id} task={task} index={index} onDelete={handleDelete} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="In Progress">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>In Progress</h2>
                {Array.isArray(tasks) && tasks.filter(task => task.status === 'In Progress').map((task, index) => (
                  <Column key={task._id} task={task} index={index} onDelete={handleDelete} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="Done">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>Done</h2>
                {Array.isArray(tasks) && tasks.filter(task => task.status === 'Done').map((task, index) => (
                  <Column key={task._id} task={task} index={index} onDelete={handleDelete} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
