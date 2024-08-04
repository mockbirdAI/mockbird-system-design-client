// src/hooks/useFlowManager.ts

import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

export const useFlowManager = (nodes: Node[], edges: Edge[]) => {
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);
  const [currentExecutionIndex, setCurrentExecutionIndex] = useState<number | null>(null);

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    nodes.forEach((node) => {
      if (node.id === nodeId) {
        node.data = { ...node.data, ...newData };
      }
    });
  }, [nodes]);

  const getNodeData = useCallback((nodeId: string) => {
    const connectedEdges = edges.filter((edge) => edge.target === nodeId);
    return connectedEdges.map((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      return sourceNode?.data.output;
    }).filter(output => output !== undefined && output !== null);
  }, [nodes, edges]);

  const handleSetOutputData = useCallback((nodeId: string) => (output: any) => {
    updateNodeData(nodeId, { output });
    const connectedEdges = edges.filter((edge) => edge.source === nodeId);
    connectedEdges.forEach((edge) => {
      const targetNode = nodes.find((node) => node.id === edge.target);
      if (targetNode) {
        updateNodeData(targetNode.id, { inputData: output });
      }
    });
  }, [edges, updateNodeData]);

  const findConnectedNodes = useCallback((startNodeId: string) => {
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
  }, [edges]);

  const runFlow = () => {
    const connectedNodeIds = findConnectedNodes('0'); // Find all nodes connected to the Start Node
    const order = nodes
      .filter((node) => connectedNodeIds.includes(node.id) && node.type === 'codeExecutionNode')
      .map((node) => node.id);

    setExecutionOrder(order);

    if (order.length > 0) {
      setCurrentExecutionIndex(0);
      updateNodeData(order[0], { executeChain: true });
    }
  };

  const handleExecutionComplete = useCallback((nodeId: string) => {
    const index = executionOrder.indexOf(nodeId);
    const nextNodeId = executionOrder[index + 1];

    if (nextNodeId) {
      setCurrentExecutionIndex(index + 1);
      updateNodeData(nextNodeId, { executeChain: true });
    } else {
      setCurrentExecutionIndex(null); // End of chain
    }
  }, [executionOrder, updateNodeData]);

  const getCodeExecutionNodes = useCallback(() => {
    return nodes.filter((node) => node.type === 'codeExecutionNode');
  }, [nodes]);

  const notifySubscriber = useCallback((nodeId: string, message: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      updateNodeData(nodeId, { inputData: message, executeChain: true });
    }
  }, [nodes, updateNodeData]);

  return {
    runFlow,
    handleSetOutputData,
    handleExecutionComplete,
    getNodeData,
    getCodeExecutionNodes,
    notifySubscriber,
    currentExecutionIndex,
    executionOrder,
  };
};
