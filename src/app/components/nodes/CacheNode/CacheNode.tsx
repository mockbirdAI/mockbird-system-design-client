// components/nodes/CacheNode.tsx

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

interface CacheEntry {
  key: string;
  value: any;
}

const CacheNode: React.FC<{ data: any }> = ({ data }) => {
  const [cache, setCache] = useState<CacheEntry[]>([]);

  const handleCacheOperation = (operation: string, key: string, value?: any) => {
    switch (operation) {
      case 'set':
        setCache((prev) => {
          if (prev.length >= (data.cacheSize || 5)) {
            prev.shift(); // Simple FIFO eviction for demonstration
          }
          return [...prev, { key, value }];
        });
        break;
      case 'get':
        return cache.find((entry) => entry.key === key)?.value || 'Not Found';
      default:
        return;
    }
  };

  return (
    <div style={{ padding: 10, border: '2px solid #00bcd4', borderRadius: 5, width: 200, backgroundColor: '#e0f7fa' }}>
      <strong>Cache: {data.label}</strong>
      <div>Size: {data.cacheSize || '5 entries'}</div>
      <div>Policy: {data.evictionPolicy || 'FIFO'}</div>
      <button onClick={() => handleCacheOperation('set', 'key1', 'value1')}>Set Cache</button>
      <div>Cache: {cache.length} items</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CacheNode;
