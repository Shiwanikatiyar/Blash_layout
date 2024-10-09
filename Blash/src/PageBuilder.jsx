import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import Draggable from './Components/Draggable';
import Droppable from './Components/Droppable';
import { db } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

function PageBuilder() {
  const [elements, setElements] = useState([]);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    if (over && over.id === 'droppable') {
      setElements((prev) => [...prev, { id: active.id, type: active.id }]);
    }
  };

  const saveLayout = async () => {
    try {
      const layout = { elements: [{ id: 'checkbox', type: 'checkbox' }] }; 
      await setDoc(doc(db, "layouts", "layout1"), layout);
      alert('Layout saved!');
    } catch (error) {
      console.error("Error saving layout: ", error);
      alert('Error saving layout');
    }
  };
  
  const loadLayout = async () => {
    try {
      const docRef = doc(db, "layouts", "layout1");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setElements(docSnap.data().elements);
        alert('Layout loaded!');
      } else {
        alert('No layout found');
      }
    } catch (error) {
      console.error("Error loading layout: ", error);
      alert('Error loading layout');
    }
  };
  
  const publishPage = () => {
    const newWindow = window.open();
    newWindow.document.write('<html><head><title>Published Page</title></head><body>');
    elements.forEach(el => {
      if (el.type === 'label') {
        newWindow.document.write('<input type="text" placeholder="Label"/><br/>');
      } else if (el.type === 'input') {
        newWindow.document.write('<input type="text" placeholder="Input Box"/><br/>');
      } else if (el.type === 'checkbox') {
        newWindow.document.write('<input type="checkbox"/><br/>');
      } else if (el.type === 'button') {
        newWindow.document.write('<input type="button" value="Button"/><br/>');
      }else if (el.type === 'table') {
        newWindow.document.write('<input type="table" value="Table"/><br/>');
      }
    });
    newWindow.document.write('</body></html>');
  };

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex' }}>
          <div className='dotted'>
            <Draggable id="label"><div><input type='text' placeholder='Label' /></div></Draggable>
            <Draggable id="input"><div><input type='text' placeholder='Input Box' /></div></Draggable>
            <Draggable id="table"><div><input type='table' value='Table' /></div></Draggable>
            <Draggable id="checkbox"><div><input type='checkbox' /> Checkbox</div></Draggable>
            <Draggable id="button"><div><input type='button' value='Button' /></div></Draggable>
          </div>
          <Droppable>
            {elements.map((el, index) => (
              <div key={index}>
                {el.type === 'label' && <input type='text' placeholder='Label' />}
                {el.type === 'input' && <input type='text' placeholder='Input Box' />}
                {el.type === 'checkbox' && <input type='checkbox' />}
                {el.type === 'button' && <input type='button' value='Button' />}
                {el.type === 'table' && <input type='table' value='Table' />}
              </div>
            ))}
          </Droppable>
        </div>
      </DndContext>

      <button onClick={() => { console.log('Saving layout...'); saveLayout(); }}>Save Layout</button>
      <button onClick={() => { console.log('Loading layout...'); loadLayout(); }}>Load Layout</button>
      <button onClick={publishPage}>Publish</button>

    </div>
  );
}

export default PageBuilder;
