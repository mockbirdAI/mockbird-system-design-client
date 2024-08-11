// app/components/FlowChartClient.tsx (Client Component)

'use client';

import FlowChart from "@/components/FlowChart";

interface DiagramsClientPros {
  diagramId: string;
  initialNodes: any[];
  initialEdges: any[];
}

export default function DiagramsClient({ diagramId, initialNodes, initialEdges }: DiagramsClientPros) {
  return (
    <FlowChart diagramId={diagramId} initialNodes={initialNodes} initialEdges={initialEdges} />
  );
}
