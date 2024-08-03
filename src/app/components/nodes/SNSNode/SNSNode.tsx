// components/nodes/SNSNode.tsx

import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

interface Subscriber {
  id: string;
  name: string;
}

const SNSNode: React.FC<{ data: any }> = ({ data }) => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [availableNodes, setAvailableNodes] = useState<Subscriber[]>([]);

  useEffect(() => {
    if (typeof data.getCodeExecutionNodes === 'function') {
      const codeExecutionNodes = data.getCodeExecutionNodes();
      setAvailableNodes(codeExecutionNodes.map((node: any) => ({ id: node.id, name: node.data.label })));
    }
  }, [data]);

  useEffect(() => {
    // If there's new input data, publish it
    if (data.inputData !== undefined && data.inputData !== null) {
      publishMessage(data.inputData);
    }
  }, [data.inputData]);

  const publishMessage = (message: string) => {
    subscribers.forEach((subscriber) => {
      console.log(`Notifying ${subscriber.name}: ${message}`);
      if (typeof data.notifySubscriber === 'function') {
        data.notifySubscriber(subscriber.id, message);
      }
    });
    if (data.onExecutionComplete) {
      data.onExecutionComplete(); // Indicate SNS node execution is complete
    }
  };

  const addSubscriber = (nodeId: string) => {
    const node = availableNodes.find((n) => n.id === nodeId);
    if (node && !subscribers.some((s) => s.id === nodeId)) {
      setSubscribers((prev) => [...prev, node]);
    }
  };

  return (
    <div style={{ padding: 10, border: '2px solid #00796b', borderRadius: 5, width: 200, backgroundColor: '#e0f2f1' }}>
      <strong>SNS: {data.label}</strong>
      <div>Subscribers: {subscribers.length}</div>
      <select onChange={(e) => addSubscriber(e.target.value)} defaultValue="">
        <option value="" disabled>
          Add Subscriber
        </option>
        {availableNodes.map((node) => (
          <option key={node.id} value={node.id}>
            {node.name}
          </option>
        ))}
      </select>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default SNSNode;
