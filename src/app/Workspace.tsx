// app/HomePageClient.tsx (Client Component)

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Diagram } from '@prisma/client';

interface WorkspaceProps {
  diagrams: Diagram[];
}

export default function Workspace({ diagrams }: WorkspaceProps) {
  const router = useRouter();

  const createNewDiagram = async () => {
    const response = await fetch('/api/create-diagram', {
      method: 'POST',
    });
  
    if (response.ok) {
      const newDiagram = await response.json();
      router.push(`/diagram/${newDiagram.id}`);
    } else {
      console.error('Failed to create a new diagram');
    }
  };

  console.log("diagrams", diagrams);
  
  return (
    <div className="container mx-auto p-8 h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Workspaces</h1>
        <button
          onClick={createNewDiagram}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Diagram
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {diagrams.map((diagram) => (
          <Link href={`/diagram/${diagram.id}`} key={diagram.id}>
            <div className="block p-4 border border-gray-200 rounded shadow hover:bg-gray-50">
              <h2 className="text-xl font-semibold">{diagram.title || 'Untitled Diagram'}</h2>
              <p className="text-gray-500">{diagram.description || 'No description available'}</p>
              <p className="text-gray-400 text-sm">Created on {new Date(diagram.createdAt).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
