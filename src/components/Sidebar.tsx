// src/components/Sidebar.tsx

import React from 'react';

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: 150, padding: 10, backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }}>
      <div style={{ marginBottom: 10 }}>Drag these nodes to the pane on the right:</div>
      <div
        onDragStart={(event) => onDragStart(event, 'startNode')}
        draggable
        style={{ marginBottom: 10, cursor: 'grab', padding: '5px', backgroundColor: '#e8f5e9' }}
      >
        Start Node
      </div>
      <div
        onDragStart={(event) => onDragStart(event, 'codeExecutionNode')}
        draggable
        style={{ marginBottom: 10, cursor: 'grab', padding: '5px', backgroundColor: '#e3f2fd' }}
      >
        Code Execution Node
      </div>
      <div
        onDragStart={(event) => onDragStart(event, 'snsNode')}
        draggable
        style={{ cursor: 'grab', padding: '5px', backgroundColor: '#f1f8e9' }}
      >
        SNS Node
      </div>
    </aside>
  );
};

export default Sidebar;
