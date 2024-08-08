// src/components/FlowChart.tsx

import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Connection,
  Edge,
  Node,
  Background,
  BackgroundVariant,
  ReactFlowInstance,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import nodeTypes from '../nodeConfig';
import { useFlowManager } from '../hooks/useFlowManager';
import { serializeDiagram, deserializeDiagram } from '../utils/diagramUtils';

import './main.css';


const flowKey = 'example-flow';

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'startNode',
    data: { label: 'Start Node', runFlow: () => {} },
    position: { x: 250, y: 5 },
  },
];

let id = 4;
const getId = (): string => `dndnode_${id++}`;

const FlowChart: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { screenToFlowPosition, setViewport } = useReactFlow();
  const flowManager = useFlowManager(nodes, edges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const handleSetCode = (id: string) => (code: string) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === id 
          ? { ...node, data: { ...node.data, code } } 
          : node
      )
    );
  };

  const handleSetPrompt = (id: string) => (prompt: string) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === id 
          ? { ...node, data: { ...node.data, prompt } } 
          : node
      )
    );
  };

  const handleSetJsonData = (id: string) => (jsonData: string) => {
    setNodes((nds) => 
      nds.map((node) => 
        node.id === id 
          ? { ...node, data: { ...node.data, jsonData } } 
          : node
      )
    );
  };

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
    console.log(rfInstance?.toObject());
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey) ?? '{}');

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );


  return (
    <div className="dndflow h-screen w-screen" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flex: 1 }}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes.map((node) => {
            if (node.type === 'codeExecutionNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  inputData: flowManager.getNodeData(node.id)[0],
                  setOutputData: flowManager.handleSetOutputData(node.id),
                  executeChain:
                    flowManager.currentExecutionIndex !== null &&
                    flowManager.executionOrder[flowManager.currentExecutionIndex] === node.id,
                  onExecutionComplete: () => flowManager.handleExecutionComplete(node.id),
                  code: node.data.code,
                  setCode: handleSetCode(node.id),
                },
              };
            }
            if (node.type === 'startNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  runFlow: flowManager.runFlow,
                },
              };
            }
            if (node.type === 'blobStorageNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  inputData: flowManager.getNodeData(node.id)[0],
                  setOutputData: flowManager.handleSetOutputData(node.id), // Ensure setOutputData is set
                  executeChain:
                    flowManager.currentExecutionIndex !== null &&
                    flowManager.executionOrder[flowManager.currentExecutionIndex] === node.id,
                  onExecutionComplete: () => flowManager.handleExecutionComplete(node.id),
                },
              };
            }
            if (node.type === 'llmNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  inputData: flowManager.getNodeData(node.id)[0],
                  setOutputData: flowManager.handleSetOutputData(node.id),
                  executeChain:
                    flowManager.currentExecutionIndex !== null &&
                    flowManager.executionOrder[flowManager.currentExecutionIndex] === node.id,
                  onExecutionComplete: () => flowManager.handleExecutionComplete(node.id),
                  prompt: node.data.prompt,
                  setPrompt: handleSetPrompt(node.id)
                },
              };
            }
            if (node.type === 'dataNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  executeChain:
                    flowManager.currentExecutionIndex !== null &&
                    flowManager.executionOrder[flowManager.currentExecutionIndex] === node.id,
                  onExecutionComplete: () => flowManager.handleExecutionComplete(node.id),
                  setOutputData: flowManager.handleSetOutputData(node.id),
                  jsonData: node.data.jsonData,
                  setJsonData: handleSetJsonData(node.id)
                },
              };
            }
            return node;
          })}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setRfInstance}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background color='#ccc' variant={BackgroundVariant.Dots} />
          <Panel position="top-right">
            <button onClick={onSave}>save</button>
            <button onClick={onRestore}>restore</button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChart;
