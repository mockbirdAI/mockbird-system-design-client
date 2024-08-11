// app/page.tsx (Server Component)

import prisma from '@/utils/prisma';
import { getSession } from '@auth0/nextjs-auth0';
import Workspace from './Workspace';
import { redirect } from 'next/navigation';

async function getDiagrams(userId: string) {
  return await prisma.diagram.findMany({
    where: { creatorUserId: userId },
  });
}

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    // Redirect to login if not authenticated
    redirect('/api/auth/login')
  }

  const diagrams = await getDiagrams(session.user.sub);

  return <Workspace diagrams={diagrams} />;
}
