// main/page.tsx

'use client';

import React, { useRef, useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from '@/app/components/Sidebar';
import nodeTypes from '@/app/nodeConfig';

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
    id: 'sns',
    type: 'snsNode',
    data: {
      label: 'SNS Node',
      inputData: null,
      getCodeExecutionNodes: () => [],
      notifySubscriber: (id: string, message: string) => {},
      onExecutionComplete: () => {},
    },
    position: { x: 250, y: 200 },
  },
  {
    id: '2',
    type: 'codeExecutionNode',
    data: {
      label: 'Code Execution Node 2',
      inputData: null,
      setOutputData: (data: any) => {},
      executeChain: false,
      onExecutionComplete: () => {},
    },
    position: { x: 250, y: 300 },
  },
];

let id = 4;
const getId = (): string => `dndnode_${id++}`;

// Create a nodeTypes object for React Flow
const reactFlowNodeTypes = nodeTypes.reduce((acc, nodeType) => {
  acc[nodeType.type] = nodeType.component;
  return acc;
}, {} as Record<string, React.ComponentType<any>>);

const DnDFlow: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);
  const [currentExecutionIndex, setCurrentExecutionIndex] = useState<number | null>(null);

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

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node))
    );
  };

  const getNodeData = (nodeId: string) => {
    const connectedEdges = edges.filter((edge) => edge.target === nodeId);
    return connectedEdges.map((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      return sourceNode?.data.output;
    });
  };

  const handleSetOutputData = (nodeId: string) => (output: any) => {
    updateNodeData(nodeId, { output });
    const connectedEdges = edges.filter((edge) => edge.source === nodeId);
    connectedEdges.forEach((edge) => {
      const targetNode = nodes.find((node) => node.id === edge.target);
      if (targetNode) {
        updateNodeData(targetNode.id, { inputData: output });
      }
    });
  };

  const findConnectedNodes = (startNodeId: string) => {
    const visited = new Set<string>();
    const stack = [startNodeId];

    while (stack.length > 0) {
      const currentNodeId = stack.pop();
      if (currentNodeId && !visited.has(currentNodeId)) {
        visited.add(currentNodeId);
        const connectedEdges = edges.filter((edge) => edge.source === currentNodeId);
        connectedEdges.forEach((edge) => {
          if (!visited.has(edge.target)) {
            stack.push(edge.target);
          }
        });
      }
    }

    return Array.from(visited);
  };

  const runFlow = () => {
    const connectedNodeIds = findConnectedNodes('0'); // Find all nodes connected to the Start Node
    const order = nodes
      .filter((node) => connectedNodeIds.includes(node.id) && (node.type === 'codeExecutionNode' || node.type === 'snsNode'))
      .map((node) => node.id);

    setExecutionOrder(order);

    if (order.length > 0) {
      setCurrentExecutionIndex(0);
      updateNodeData(order[0], { executeChain: true });
    }
  };

  const handleExecutionComplete = (nodeId: string) => {
    const index = executionOrder.indexOf(nodeId);
    const nextNodeId = executionOrder[index + 1];

    if (nextNodeId) {
      setCurrentExecutionIndex(index + 1);
      updateNodeData(nextNodeId, { executeChain: true });
    } else {
      setCurrentExecutionIndex(null); // End of chain
    }
  };

  const getCodeExecutionNodes = () => {
    return nodes.filter((node) => node.type === 'codeExecutionNode');
  };

  const notifySubscriber = (nodeId: string, message: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      updateNodeData(nodeId, { inputData: message, executeChain: true }); // Trigger execution
    }
  };

  return (
    <div className="dndflow h-screen w-screen">
      <Sidebar />
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodeTypes={reactFlowNodeTypes}
          nodes={nodes.map((node) => {
            if (node.type === 'codeExecutionNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  inputData: getNodeData(node.id)[0],
                  setOutputData: handleSetOutputData(node.id),
                  executeChain: currentExecutionIndex !== null && executionOrder[currentExecutionIndex] === node.id,
                  onExecutionComplete: () => handleExecutionComplete(node.id),
                },
              };
            }
            if (node.type === 'startNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  runFlow,
                },
              };
            }
            if (node.type === 'snsNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  inputData: getNodeData(node.id)[0], // Pass input data to SNS node
                  getCodeExecutionNodes,
                  notifySubscriber,
                  onExecutionComplete: () => handleExecutionComplete(node.id),
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
        </ReactFlow>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);

export default App;
