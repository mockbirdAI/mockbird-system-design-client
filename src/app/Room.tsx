"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

export function Room({ children, roomId }: { children: ReactNode, roomId: string }) {
  return (
    <LiveblocksProvider publicApiKey={"pk_prod__9V7BC9PmW4FAu4ZWKyuQd-OONSXRjDohvNzX7h_ar_i_W5KL82SAhhF_zb4CJfz"}>
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