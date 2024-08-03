// components/nodes/DatabaseNode.tsx

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const DatabaseNode: React.FC<{ data: any }> = ({ data }) => {
  const [dbData, setDbData] = useState<any[]>([]);

  const handleOperation = (operation: string, input: any) => {
    switch (operation) {
      case 'create':
        setDbData((prev) => [...prev, input]);
        break;
      case 'read':
        return dbData;
      case 'update':
        setDbData((prev) => prev.map((item) => (item.id === input.id ? input : item)));
        break;
      case 'delete':
        setDbData((prev) => prev.filter((item) => item.id !== input.id));
        break;
      default:
        return;
    }
  };

  return (
    <div style={{ padding: 10, border: '2px solid #ffa500', borderRadius: 5, width: 200, backgroundColor: '#fff8e1' }}>
      <strong>Database: {data.label}</strong>
      <div>Type: {data.dbType || 'SQL'}</div>
      <div>Storage: {data.storage || '100GB'}</div>
      <button onClick={() => handleOperation('create', { id: Date.now(), value: 'New Entry' })}>
        Create Entry
      </button>
      <div>Entries: {dbData.length}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default DatabaseNode;
