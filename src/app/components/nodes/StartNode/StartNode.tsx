// components/nodes/StartNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const StartNode: React.FC<{ data: any }> = ({ data }) => {
  const startExecution = () => {
    if (data.runFlow) {
      data.runFlow(); // Trigger the flow execution
    }
  };

  return (
    <div
      onClick={startExecution}
      style={{
        padding: 10,
        border: '2px solid #28a745',
        borderRadius: 5,
        width: 120,
        backgroundColor: '#f0fff4',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <strong>Start Node</strong>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default StartNode;
