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
import Cursor from './Cursor';
import useInterval from '@/app/hooks/useInterval';

import Sidebar from './Sidebar';
import nodeTypes from '../nodeConfig';
import { useFlowManager } from '@/app/hooks/useFlowManager';
import { serializeDiagram, deserializeDiagram } from '../utils/diagramUtils';

import './main.css';
import GenerateFlowchart from '@/components/GenerateFlowChart';
import useStore from '@/utils/store';
import { useBroadcastEvent, useMyPresence, useOthers } from '@liveblocks/react';

interface FlowChartProps {
  diagramId?: string,
  initialNodes: Node[],
  initialEdges: Edge[]
}

const flowKey = 'example-flow';

let id = 0;
const getId = (): string => `${id++}`;

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

enum CursorMode {
  Hidden,
  Chat,
  ReactionSelector,
  Reaction,
}

type CursorState =
  | {
      mode: CursorMode.Hidden;
    }
  | {
      mode: CursorMode.Chat;
      message: string;
      previousMessage: string | null;
    }
  | {
      mode: CursorMode.ReactionSelector;
    }
  | {
      mode: CursorMode.Reaction;
      reaction: string;
      isPressed: boolean;
    };
    
const FlowChart: React.FC<FlowChartProps> = ({ diagramId, initialNodes, initialEdges }) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const broadcast = useBroadcastEvent();
  const [state, setState] = useState<CursorState>({ mode: CursorMode.Hidden });
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const { screenToFlowPosition, setViewport } = useReactFlow();

  const {
    liveblocks: { enterRoom, leaveRoom, isStorageLoading, room },
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

  const enteredRoomRef = useRef(false); // Track if initialization has occurred
  useEffect(() => {
    if (!isStorageLoading && nodes.length === 0 && edges.length === 0) {
      // Only set initial nodes and edges if the room is empty
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [isStorageLoading, nodes, edges, setNodes, setEdges, initialNodes, initialEdges]);

  useEffect(() => {
    if (!enteredRoomRef.current) {
      if (!room?.id) {
        if (room?.getOthers()) {
          enterRoom(diagramId!);
          enteredRoomRef.current = true;
        }
      }
    }
  }, [diagramId, room?.id, enterRoom]);

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
    <div
      className="dndflow h-full w-full" 
      style={{ 
        display: 'flex', 
        cursor: "url(cursor.svg) 0 0, auto",
      }}
      onPointerMove={(event) => {
        event.preventDefault();
        if (cursor == null || state.mode !== CursorMode.ReactionSelector) {
          updateMyPresence({
            cursor: {
              x: Math.round(event.clientX),
              y: Math.round(event.clientY),
            },
          });
        }
      }}
      onPointerLeave={() => {
        setState({
          mode: CursorMode.Hidden,
        });
        updateMyPresence({
          cursor: null,
        });
      }}
      onPointerDown={(event) => {
        updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        });
        setState((state) =>
          state.mode === CursorMode.Reaction
            ? { ...state, isPressed: true }
            : state
        );
      }}
      onPointerUp={() => {
        setState((state) =>
          state.mode === CursorMode.Reaction
            ? { ...state, isPressed: false }
            : state
        );
      }}
    >
      <Sidebar />
      <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flex: 1 }}>
        {others.map(({ connectionId, presence }) => {
          if (presence == null || !presence.cursor) {
            return null;
          }

          return (
            <Cursor
              key={connectionId}
              color={COLORS[connectionId % COLORS.length]}
              x={presence.cursor.x}
              y={presence.cursor.y}
              message={presence.message}
            />
          );
        })}
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
          <Controls position='top-left'/>
          <Background color='#ccc' variant={BackgroundVariant.Dots} />
          {/* <Panel position="top-right">
            <button onClick={onSave}>save</button>
            <button onClick={onRestore}>restore</button>
          </Panel> */}
        </ReactFlow>
        <GenerateFlowchart addNodesAndEdges={addNodesAndEdges} currentDiagram={{ nodes, edges }} />
      </div>
    </div>
  );
};

export default FlowChart;
