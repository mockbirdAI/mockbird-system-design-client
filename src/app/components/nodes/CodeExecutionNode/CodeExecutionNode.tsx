// components/nodes/CodeExecutionNode.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeExecutionNodeProps extends NodeProps {
  data: {
    label: string;
    inputData: any;
    setOutputData: (data: any) => void;
    executeChain: boolean;
    onExecutionComplete: () => void;
  };
}

const CodeExecutionNode: React.FC<CodeExecutionNodeProps> = ({ data }) => {
  const [code, setCode] = useState('// Write your code here');
  const [output, setOutput] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // Function to execute code with given input
  const executeCode = useCallback(() => {
    try {
      setIsExecuting(true);
      const input = data.inputData;
      console.log('Input received:', input);
      const result = new Function('input', code)(input);
      setOutput(result?.toString());
      data.setOutputData(result);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsExecuting(false);
      }, 1000); // 1-second delay for visual effect
    }
  }, [code, data]);

  // Function to execute code as part of the chain
  const executeChainCode = useCallback(() => {
    try {
      setIsExecuting(true);
      const input = data.inputData;
      console.log('Input received:', input);
      const result = new Function('input', code)(input);
      setOutput(result?.toString());
      data.setOutputData(result);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsExecuting(false);
        data.onExecutionComplete();
      }, 1000); // 1-second delay for visual effect
    }
  }, [code, data]);

  const toggleEditor = () => setShowEditor((prev) => !prev);

  useEffect(() => {
    if (data.executeChain) {
      executeChainCode(); // Execute code as part of the chain
    }
  }, [data.executeChain, executeChainCode]);

  return (
    <div
      style={{
        padding: 10,
        border: `2px solid ${isExecuting ? '#007bff' : '#ddd'}`,
        borderRadius: 5,
        width: 300,
        backgroundColor: isExecuting ? '#e7f1ff' : '#f7f7f7',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <strong>{data.label}</strong>
        <button onClick={toggleEditor} style={{ padding: '5px 10px', cursor: 'pointer' }}>
          {showEditor ? 'Hide Editor' : 'Show Editor'}
        </button>
      </div>
      {showEditor && (
        <div style={{ marginBottom: 10 }}>
          <CodeMirror
            value={code}
            height="150px"
            theme={oneDark}
            extensions={[javascript()]}
            onChange={(value) => setCode(value)}
            style={{ marginBottom: 10, borderRadius: 5 }}
          />
          <button onClick={executeCode} style={{ padding: '5px 10px', cursor: 'pointer' }}>
            Run Code
          </button>
        </div>
      )}
      <div>
        <strong>Output:</strong> {output}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CodeExecutionNode;
