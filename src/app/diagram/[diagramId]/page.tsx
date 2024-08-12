// app/[diagramId]/page.tsx (Server Component)

import prisma from '@/utils/prisma';
import { Room } from "@/app/Room";
import { CollaborativeApp } from "@/app/CollaborativeApp";
import DiagramsClient from '@/app/diagram/[diagramId]/DiagramsClient';
import { ReactFlowProvider } from "@xyflow/react";
import EditableDiagramTitle from '@/components/EditableDiagramTitle';

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
    <div className='h-screen w-screen'>
      <Room roomId={params.diagramId}>
        <div className='flex w-full justify-between p-4' style={{ backgroundColor: '#f0f0f0', borderBottom: 'solid', borderWidth: '1px' }}>
          {/* Pass the diagram data to EditableField */}
          <EditableDiagramTitle diagramId={diagram.id} initialValue={diagram.title} field="title" />
          <div>
            <CollaborativeApp />
          </div>
        </div>
        
        <ReactFlowProvider>
          <DiagramsClient diagramId={params.diagramId} initialNodes={initialNodes} initialEdges={initialEdges} />
        </ReactFlowProvider>
      </Room>
    </div>
    
  );
}
