// src/components/nodes/DataNode.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface DataNodeProps extends NodeProps {
  data: {
    label: string;
    executeChain: boolean;
    onExecutionComplete: () => void;
    setOutputData: (data: any) => void;
    jsonData?: string;
    setJsonData: (jsonData: string) => void;
  };
}

const DataNode: React.FC<DataNodeProps> = ({ data }) => {
  const [parsedData, setParsedData] = useState<any>(null);
  const [isValid, setIsValid] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);

  // Parse JSON data and set it as output
  const parseAndSetData = useCallback(() => {
    try {
      const parsed = JSON.parse(data.jsonData ?? '{}');
      setParsedData(parsed);
      setIsValid(true);
      return parsed;
    } catch (error) {
      setParsedData(null);
      setIsValid(false);
      return null;
    }
  }, [data.jsonData]);

  const executeNode = useCallback(() => {
    setIsExecuting(true);
    const parsed = parseAndSetData();
    if (parsed) {
      data.setOutputData(parsed);
    }
    setTimeout(() => {
      setIsExecuting(false);
      data.onExecutionComplete();
    }, 1000); // Short delay for visual effect
  }, [data, parseAndSetData]);

  useEffect(() => {
    if (data.executeChain) {
      executeNode();
    }
  }, [data.executeChain, executeNode]);

  return (
    <div
      style={{
        padding: 10,
        border: `2px solid ${isValid ? '#ddd' : 'red'}`,
        borderRadius: 5,
        width: 300,
        backgroundColor: isExecuting ? '#e7f1ff' : '#f7f7f7',
        transition: 'background-color 0.3s ease',
      }}
    >
      <strong>{data.label}</strong>
      <textarea
        value={data.jsonData}
        onChange={(e) => data.setJsonData(e.target.value)}
        placeholder="Enter JSON data here..."
        style={{ width: '100%', marginTop: 10, height: 100 }}
      />
      {!isValid && <div style={{ color: 'red' }}>Invalid JSON</div>}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default DataNode;
