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
    <div style={{ padding: 10, border: '2px solid #4caf50', borderRadius: 5, width: 150, backgroundColor: '#e8f5e9' }}>
      <strong>Start Node</strong>
      <button onClick={data.runFlow} style={{ marginTop: 10, cursor: 'pointer', padding: '5px 10px' }}>
        Start
      </button>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default StartNode;
