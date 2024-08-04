// components/nodes/OutputNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const OutputNode: React.FC<{ data: any }> = ({ data }) => (
  <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
    <div>{data.label}</div>
    <Handle type="target" position={Position.Top} />
  </div>
);

export default OutputNode;
