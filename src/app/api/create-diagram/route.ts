// app/api/diagrams/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(request: Request) {
  // Get the user session
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Get the user's email or ID
  const userEmail = session.user.email;

  // Verify that the user exists in the database using email
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Create a new diagram in the database
  try {
    const newDiagram = await prisma.diagram.create({
      data: {
        title: 'Untitled Diagram',
        creatorUserId: user.id, // Now we're using the correct user ID
        blobUrl: '', // Initialize with an empty blobUrl or other default values
      },
    });

    // Return the newly created diagram as the response
    return NextResponse.json(newDiagram, { status: 201 });
  } catch (error) {
    console.error('Error creating diagram:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
