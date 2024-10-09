import { useDroppable } from '@dnd-kit/core';

function Droppable({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'droppable' });
  const style = {
    width: 400,
    height: 400,
    border: '2px solid black',
    backgroundColor: isOver ? 'lightblue' : 'white',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default Droppable;
