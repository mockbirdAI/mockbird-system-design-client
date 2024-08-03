// components/nodes/InputNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const InputNode: React.FC<{ data: any }> = ({ data }) => (
  <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
    <div>{data.label}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

export default InputNode;
