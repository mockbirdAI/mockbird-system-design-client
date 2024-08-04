// src/components/nodes/SNSNode.tsx

import React, { useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface SNSNodeProps extends NodeProps {
  data: {
    label: string;
    inputData: any;
    getCodeExecutionNodes: () => { id: string; name: string }[];
    notifySubscriber: (id: string, message: string) => void;
    onExecutionComplete: () => void;
  };
}

const SNSNode: React.FC<SNSNodeProps> = ({ data }) => {
  const [subscribers, setSubscribers] = useState<{ id: string; name: string }[]>([]);
  const [availableNodes, setAvailableNodes] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const codeExecutionNodes = data.getCodeExecutionNodes();
    setAvailableNodes(codeExecutionNodes.map((node) => ({ id: node.id, name: node.name })));
  }, [data]);

  useEffect(() => {
    if (data.inputData !== undefined && data.inputData !== null) {
      publishMessage(data.inputData);
    }
  }, [data.inputData]);

  const publishMessage = (message: string) => {
    subscribers.forEach((subscriber) => {
      console.log(`Notifying ${subscriber.name}: ${message}`);
      data.notifySubscriber(subscriber.id, message);
    });
    data.onExecutionComplete();
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
