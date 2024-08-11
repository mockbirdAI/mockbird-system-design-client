'use client'

import { Room } from "@/app/Room";
import { CollaborativeApp } from "@/app/CollaborativeApp";
import FlowChart from "@/components/FlowChart";
import { ReactFlowProvider } from "@xyflow/react";

export default function Page() {
  return (
    <Room roomId="my-room1">
      <CollaborativeApp />
      <ReactFlowProvider>
        <FlowChart />
      </ReactFlowProvider>
    </Room>
  );
}