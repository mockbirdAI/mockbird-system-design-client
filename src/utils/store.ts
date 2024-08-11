import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  XYPosition,
} from "@xyflow/react";
import { createClient } from "@liveblocks/client";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";

const client = createClient({
  publicApiKey: "pk_prod__9V7BC9PmW4FAu4ZWKyuQd-OONSXRjDohvNzX7h_ar_i_W5KL82SAhhF_zb4CJfz",
  throttle: 16,
});

type FlowState = {
  nodes: Node[];
  edges: Edge[];
  executionOrder: string[];
  currentExecutionIndex: number | null;
  setNodes: (newNodes: Node[]) => void;
  setEdges: (newEdges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  handleSetCode: (id: string) => (code: string) => void;
  handleSetPrompt: (id: string) => (prompt: string) => void;
  handleSetJsonData: (id: string) => (jsonData: string) => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: (event: React.DragEvent, screenToFlowPosition: (pos: XYPosition) => XYPosition, getId: () => string) => void;
  addNodesAndEdges: (newNodes: Node[], newEdges: Edge[]) => void;
  handleSetOutputData: (nodeId: string) => (output: any) => void;
  getNodeData: (nodeId: string) => any[];
  updateNodeData: (nodeId: string, newData: any) => void;
  setExecutionOrder: (newExecutionOrder: any) => void;
  setCurrentExecutionIndex: (newCurrentExecutionIndex: any) => void;
};

const useStore = create<WithLiveblocks<FlowState>>()(
  liveblocks(
    (set, get) => ({
      nodes: [],
      edges: [],
      executionOrder: [],
      currentExecutionIndex: null,

      setExecutionOrder: (newExecutionOrder: any) => {
        set({ executionOrder: newExecutionOrder })
      },

      setCurrentExecutionIndex: (newCurrentExecutionIndex: any) => {
        set({ currentExecutionIndex: newCurrentExecutionIndex })
      },

      setNodes: (newNodes: Node[]) => {
        set({ nodes: newNodes });
      },

      setEdges: (newEdges: Edge[]) => {
        set({ edges: newEdges });
      },

      onNodesChange: (changes: NodeChange[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },

      updateNodeData: (nodeId: string, newData: any) => {
        set((state) => {
            const updatedNodes = state.nodes.map((node) =>
                node.id === nodeId && node.data !== newData ? { ...node, data: { ...node.data, ...newData } } : node
            );
            return { nodes: updatedNodes };
        });
    },
      handleSetCode: (id: string) => (code: string) => {
        get().updateNodeData(id, { code });
      },

      handleSetPrompt: (id: string) => (prompt: string) => {
        get().updateNodeData(id, { prompt });
      },

      handleSetJsonData: (id: string) => (jsonData: string) => {
        get().updateNodeData(id, { jsonData });
      },

      onDragOver: (event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      },

      onDrop: (event: React.DragEvent, screenToFlowPosition: (pos: XYPosition) => XYPosition, getId: () => string) => {
        event.preventDefault();

        const type = event.dataTransfer.getData("application/reactflow");

        if (!type) {
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

        set({
          nodes: get().nodes.concat(newNode),
        });
      },

      addNodesAndEdges: (newNodes: Node[], newEdges: Edge[]) => {
        set({
          nodes: get().nodes.concat(newNodes),
          edges: get().edges.concat(newEdges),
        });
      },

      getNodeData: (nodeId: string) => {
        const connectedEdges = get().edges.filter((edge) => edge.target === nodeId);
        return connectedEdges
          .map((edge) => {
            const sourceNode = get().nodes.find((node) => node.id === edge.source);
            return sourceNode?.data.output;
          })
          .filter((output) => output !== undefined && output !== null);
      },

      handleSetOutputData: (nodeId: string) => (output: any) => {
        get().updateNodeData(nodeId, { output });
        const connectedEdges = get().edges.filter((edge) => edge.source === nodeId);
        const nodes = get().nodes;
        connectedEdges.forEach((edge) => {
          const targetNode = nodes.find((node) => node.id === edge.target);
          if (targetNode) {
            set({
              nodes: nodes.map((node) =>
                node.id === targetNode.id
                  ? { ...node, data: { ...node.data, inputData: output } }
                  : node
              ),
            });
          }
        });
      },
    }),
    {
      client,
      storageMapping: {
        nodes: true,
        edges: true,
      },
    }
  )
);

export default useStore;
