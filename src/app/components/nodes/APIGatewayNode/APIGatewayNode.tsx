// components/nodes/APIGatewayNode.tsx

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const APIGatewayNode: React.FC<{ data: any }> = ({ data }) => {
  const [requests, setRequests] = useState<number>(0);

  const handleRequest = () => {
    if (requests < (data.rateLimit || 10)) {
      setRequests((prev) => prev + 1);
    } else {
      console.log('Rate limit exceeded');
    }
  };

  return (
    <div style={{ padding: 10, border: '2px solid #ff5722', borderRadius: 5, width: 200, backgroundColor: '#fbe9e7' }}>
      <strong>API Gateway: {data.label}</strong>
      <div>Rate Limiting: {data.rateLimit || '10 req/min'}</div>
      <button onClick={handleRequest}>Handle Request</button>
      <div>Requests: {requests}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default APIGatewayNode;
