// src/components/Sidebar.tsx

import React from 'react';
import nodeTypes from '../nodeConfig';

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: 150, padding: 10, backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }}>
      <div style={{ marginBottom: 10 }}>Drag these nodes to the pane on the right:</div>
      {Object.keys(nodeTypes).map((type) => (
        <div
          key={type}
          onDragStart={(event) => onDragStart(event, type)}
          draggable
          style={{
            marginBottom: 10,
            cursor: 'grab',
            padding: '5px',
            backgroundColor: getNodeColor(type),
          }}
        >
          {type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
        </div>
      ))}
    </aside>
  );
};

// Helper function to assign colors to nodes based on type
const getNodeColor = (type: string): string => {
  switch (type) {
    case 'startNode':
      return '#e8f5e9';
    case 'codeExecutionNode':
      return '#e3f2fd';
    case 'snsNode':
      return '#f1f8e9';
    case 'blobStorageNode':
      return '#fff3e0';
    default:
      return '#f0f0f0';
  }
};

export default Sidebar;
