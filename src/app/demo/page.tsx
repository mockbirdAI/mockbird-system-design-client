'use client'
// app/page.tsx (Server Component)
import { ReactFlowProvider } from "@xyflow/react";
import FlowChart from '@/components/FlowChart';
import Demo from "./Demo";

export default function Page() { 
  return (
      <ReactFlowProvider>
        <Demo />
      </ReactFlowProvider>
  );
}
