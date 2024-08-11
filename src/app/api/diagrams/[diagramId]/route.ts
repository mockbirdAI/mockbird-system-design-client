// src/app/api/diagrams/[diagramId]/route.ts (API Route)

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function PATCH(request: Request, { params }: { params: { diagramId: string } }) {
  const diagramId = params.diagramId;
  const updates = await request.json();

  try {
    const updatedDiagram = await prisma.diagram.update({
      where: { id: diagramId },
      data: updates,
    });

    return NextResponse.json(updatedDiagram);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update diagram' }, { status: 500 });
  }
}
