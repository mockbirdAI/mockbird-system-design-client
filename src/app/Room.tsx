"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children, roomId }: { children: ReactNode, roomId: string }) {
  return (
    <LiveblocksProvider publicApiKey={"pk_prod_e1kjkJy-Crc-J5flpjvpyWJpV5p9wnnNZbHG0FjVCvTjqSTo-Iya7wqvCztTczW9"}>
      <RoomProvider
        id={roomId}
        initialPresence={
            () => ({
          cursor: null,
          message: "",
        })}
      >
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}