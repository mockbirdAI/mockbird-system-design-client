// src/components/FlowChart.tsx

import React, { useRef, useCallback } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';
import nodeTypes from '../nodeConfig';
import { useFlowManager } from '../hooks/useFlowManager';

import './main.css';

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'startNode',
    data: { label: 'Start Node', runFlow: () => {} },
    position: { x: 250, y: 5 },
  },
  {
    id: '1',
    type: 'codeExecutionNode',
    data: {
      label: 'Code Execution Node 1',
      inputData: null,
      setOutputData: (data: any) => {},
      executeChain: false,
      onExecutionComplete: () => {},
    },
    position: { x: 250, y: 100 },
  },
  {
    id: 'blob',
    type: 'blobStorageNode',
    data: {
      label: 'Blob Storage Node',
      inputData: null,
      executeChain: false,
      onExecutionComplete: () => {},
    },
    position: { x: 250, y: 200 },
  },
];

let id = 4;
const getId = (): string => `dndnode_${id++}`;

const FlowChart: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const flowManager = useFlowManager(nodes, edges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

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
        data: { label: `${type} node` },
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
                  executeChain:
                    flowManager.currentExecutionIndex !== null &&
                    flowManager.executionOrder[flowManager.currentExecutionIndex] === node.id,
                  onExecutionComplete: () => flowManager.handleExecutionComplete(node.id),
                },
              };
            }
            return node;
          })}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
          <Background color='#ccc' variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChart;
