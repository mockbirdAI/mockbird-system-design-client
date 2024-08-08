// src/utils/diagramUtils.ts

import { Node, Edge } from '@xyflow/react';

// Serialize the nodes and edges to JSON
export const serializeDiagram = (nodes: Node[], edges: Edge[]): string => {
  const data = {
    nodes: nodes.map(node => ({
      ...node,
      position: { x: node.position.x, y: node.position.y },
      data: { ...node.data },
    })),
    edges: edges.map(edge => ({ ...edge })),
  };
  return JSON.stringify(data, null, 2);
};

// Deserialize the JSON to nodes and edges
export const deserializeDiagram = (json: string): { nodes: Node[]; edges: Edge[] } => {
  const data = JSON.parse(json);
  return {
    nodes: data.nodes.map((node: any) => ({
      ...node,
      position: { x: node.position.x, y: node.position.y },
      data: { ...node.data },
    })),
    edges: data.edges.map((edge: any) => ({ ...edge })),
  };
};
