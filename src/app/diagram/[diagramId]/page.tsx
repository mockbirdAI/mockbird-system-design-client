// app/page.tsx (Server Component)

import prisma from '@/utils/prisma';
import { Room } from "@/app/Room";
import { CollaborativeApp } from "@/app/CollaborativeApp";
import DiagramsClient from '@/app/diagram/[diagramId]/DiagramsClient'
import { ReactFlowProvider } from "@xyflow/react";

export default async function Page({ params }: { params: { diagramId: string } }) {
  
  // Fetch diagram data using Prisma
  const diagram = await prisma.diagram.findUnique({
    where: {
      id: params.diagramId,
    },
    include: {
      creator: true, // Include related data if needed
    },
  });

  if (!diagram) {
    return <div>Diagram not found</div>;
  }

  // Parse the blobUrl to extract nodes and edges
  let initialNodes = [];
  let initialEdges = [];

  if (diagram.blobUrl) {
    const diagramData = await fetch(diagram.blobUrl).then(res => res.json());
    initialNodes = diagramData.nodes || [];
    initialEdges = diagramData.edges || [];
  }

  return (
    <Room roomId={params.diagramId}>
      <CollaborativeApp />
      <ReactFlowProvider>
        {/* Pass the fetched data to the client component */}
        <DiagramsClient diagramId={params.diagramId} initialNodes={initialNodes} initialEdges={initialEdges} />
      </ReactFlowProvider>
    </Room>
  );
}
