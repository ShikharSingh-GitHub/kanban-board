import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Task from './Task';

const Column = React.memo(({ task, index, onDelete }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <div
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className="task"
        >
          <Task task={task} onDelete={onDelete} />
        </div>
      )}
    </Draggable>
  );
});

export default Column;
