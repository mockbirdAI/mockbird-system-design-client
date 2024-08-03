// components/Sidebar.tsx

import React from 'react';
import nodeTypes, { NodeType } from '../nodeConfig'; // Import NodeType for type annotations

const Sidebar: React.FC = () => {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      {nodeTypes.map((node: NodeType) => (
        <div
          key={node.type}
          className="dndnode"
          onDragStart={(event) => onDragStart(event, node.type)}
          draggable
        >
          {node.label}
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
