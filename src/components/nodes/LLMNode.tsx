// src/components/nodes/LLMNode.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface LLMNodeProps extends NodeProps {
  data: {
    label: string;
    inputData: any;
    setOutputData: (data: any) => void;
    executeChain: boolean;
    onExecutionComplete: () => void;
  };
}

const LLMNode: React.FC<LLMNodeProps> = ({ data }) => {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeLLMQuery = useCallback(async () => {
    try {
      setIsExecuting(true);

      let substitutedPrompt = prompt;

      if (typeof data.inputData === 'object' && data.inputData !== null) {
        // Replace ${input.property} for objects
        substitutedPrompt = prompt.replace(/\${input\.(\w+)}/g, (_, prop) => {
          return data.inputData[prop] !== undefined ? data.inputData[prop] : '';
        });
      } else {
        // Replace ${input} for primitives
        substitutedPrompt = prompt.replace(/\${input}/g, String(data.inputData));
      }
      const response = await fetch(`https://mockbird-node-llm-function-app.azurewebsites.net/api/openAiRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: substitutedPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GPT response.');
      }

      const gptResponse = await response.text();
      setOutput(gptResponse);
      data.setOutputData(gptResponse);
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setTimeout(() => {
        setIsExecuting(false);
        data.onExecutionComplete();
      }, 1000); // 1-second delay for visual effect
    }
  }, [prompt, data]);

  useEffect(() => {
    if (data.executeChain) {
      console.log("executing llmNode")
      executeLLMQuery(); // Execute the LLM query as part of the chain
    }
  }, [data.executeChain]);

  return (
    <div
      style={{
        padding: 10,
        border: `2px solid ${isExecuting ? '#007bff' : '#c04bfa'}`,
        borderRadius: 5,
        width: 300,
        backgroundColor: isExecuting ? '#e7f1ff' : '#e9c0fc',
        transition: 'background-color 0.3s ease',
      }}
    >
      <strong>{data.label}</strong>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here (use ${input} to include input data)..."
        style={{ width: '100%', marginTop: 10 }}
      />
      <button onClick={executeLLMQuery} style={{ marginTop: 10, padding: '5px 10px', cursor: 'pointer' }}>
        Run Query
      </button>
      <div>
        <strong>Output:</strong> <pre>{output}</pre>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default LLMNode;
