// src/components/nodes/StartNode.tsx

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface StartNodeProps extends NodeProps {
  data: {
    label: string;
    runFlow: () => void;
  };
}

const StartNode: React.FC<StartNodeProps> = ({ data }) => {
  return (
    <div style={{ display: 'flex', padding: 20, border: '2px solid #4caf50', borderRadius: 5, width: 150, backgroundColor: '#e8f5e9', justifyContent: 'center' }}>
      <button onClick={data.runFlow} style={{ cursor: 'pointer' }}>
        <strong>Start Node</strong>
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default StartNode;
