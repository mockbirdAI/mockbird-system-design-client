// src/App.tsx

'use client'

import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import FlowChart from '@/components/FlowChart'

const App: React.FC = () => (
  <ReactFlowProvider>
    <FlowChart />
  </ReactFlowProvider>
);

export default App;
