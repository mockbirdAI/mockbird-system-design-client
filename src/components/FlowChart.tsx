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
import { useFlowManager } from '@/app/hooks/useFlowManager';
import { serializeDiagram, deserializeDiagram } from '../utils/diagramUtils';

import './main.css';
import GenerateFlowchart from '@/components/GenerateFlowChart';
import useStore from '@/utils/store';


const flowKey = 'example-flow';

const initialNodes: Node[] = [];

let id = 0;
const getId = (): string => `${id++}`;

const FlowChart: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { screenToFlowPosition, setViewport } = useReactFlow();

  const {
    liveblocks: { enterRoom, leaveRoom, isStorageLoading },
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDragOver,
    onDrop,
    addNodesAndEdges,
    handleSetOutputData,
    handleSetCode,
    handleSetPrompt,
    handleSetJsonData,
    getNodeData,
    currentExecutionIndex,
    executionOrder,
    setExecutionOrder,
    setCurrentExecutionIndex,
    updateNodeData
  } = useStore();

  // const flowManager = useFlowManager(nodes, edges);

  useEffect(() => {
    enterRoom('my-room');
  }, [enterRoom]);

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


  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      onDrop(event, screenToFlowPosition, getId);
    },
    [onDrop, screenToFlowPosition, getId]
  );

  const findConnectedNodes = useCallback(
    (startNodeId: string) => {
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
    },
    [edges]
  );

  const runFlow = useCallback(
    (startNodeId: string = '0') => {
      const connectedNodeIds = findConnectedNodes(startNodeId); // Find all nodes connected to the starting node
      const order = nodes
        .filter((node) => connectedNodeIds.includes(node.id) && (node.type === 'codeExecutionNode' || node.type === 'blobStorageNode' || node.type === 'llmNode' || node.type === 'dataNode'))
        .map((node) => node.id);

      setExecutionOrder(order);

      if (order.length > 0) {
        setCurrentExecutionIndex(0);
        updateNodeData(order[0], { executeChain: true });
      }
      console.log(connectedNodeIds);
    },
    [nodes, findConnectedNodes, updateNodeData]
  );

  const handleExecutionComplete = useCallback(
    (nodeId: string) => {
      const index = executionOrder.indexOf(nodeId);
      const nextNodeId = executionOrder[index + 1];

      if (nextNodeId) {
        setCurrentExecutionIndex(index + 1);
        updateNodeData(nextNodeId, { executeChain: true });
      } else {
        setCurrentExecutionIndex(null); // End of chain
      }
    },
    [executionOrder, updateNodeData]
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
                  inputData: getNodeData(node.id)[0],
                  setOutputData: handleSetOutputData(node.id),
                  executeChain:
                    currentExecutionIndex !== null &&
                    executionOrder[currentExecutionIndex] === node.id,
                  onExecutionComplete: () => handleExecutionComplete(node.id),
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
                  runFlow: () => runFlow(node.id),
                },
              };
            }
            if (node.type === 'blobStorageNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  inputData: getNodeData(node.id)[0],
                  setOutputData: handleSetOutputData(node.id), // Ensure setOutputData is set
                  executeChain:
                    currentExecutionIndex !== null &&
                    executionOrder[currentExecutionIndex] === node.id,
                  onExecutionComplete: () => handleExecutionComplete(node.id),
                },
              };
            }
            if (node.type === 'llmNode') {
              return {
                ...node,
                data: {
                  ...node.data,
                  inputData: getNodeData(node.id)[0],
                  setOutputData: handleSetOutputData(node.id),
                  executeChain:
                    currentExecutionIndex !== null &&
                    executionOrder[currentExecutionIndex] === node.id,
                  onExecutionComplete: () => handleExecutionComplete(node.id),
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
                    currentExecutionIndex !== null &&
                    executionOrder[currentExecutionIndex] === node.id,
                  onExecutionComplete: () => handleExecutionComplete(node.id),
                  setOutputData: handleSetOutputData(node.id),
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
          onDrop={handleDrop}
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
        <GenerateFlowchart addNodesAndEdges={addNodesAndEdges} currentDiagram={{ nodes, edges }} />
      </div>
    </div>
  );
};

export default FlowChart;
