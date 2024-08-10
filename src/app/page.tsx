// src/App.tsx

'use client'

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import FlowChart from '@/components/FlowChart'
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';

const App: React.FC = () => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  
  console.log(user);
  if (!user) {
    redirect('/api/auth/login');
  }

  return (
    <ReactFlowProvider>
      <FlowChart />
    </ReactFlowProvider>
  )
};

export default App;
