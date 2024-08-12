"use client";

import { Avatar } from "@/components/common/Avatar";
import { useSelf, useOthers } from "@liveblocks/react";
import styles from "./collaborativeapp.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";

export function CollaborativeApp() {
  const users = useOthers();
  const currentUser = useSelf();
  const { user, error, isLoading } = useUser();
  const hasMoreUsers = users.length > 3;
  return (
    <main className="flex select-none place-content-end" style={{ backgroundColor: '#f0f0f0' }}>
      <div className="flex pl-3">
        {users.slice(0, 3).map(({ connectionId, info }) => {
          return (
            <Avatar key={connectionId} src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAtgMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQcC/8QAFxABAQEBAAAAAAAAAAAAAAAAAAFBEf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AxAAAAAAAAFEVARUAVFAAAioAqAAAAACAKACAKKIqKgAAACiKggqKAAAAAAAqKDkAFAAEUEoUBRAFAFAAQVBAABUICgAAAgoAgAAAAAAAogKoACKAgqCAoAigKIAAAgqAKgAAAAAAAqAKgooAAAIAAAAACgAIKggAAAAAAACiHQUAUAAAEIqAoBAAAAAQKCAAAAAAAAEVFAAAAAAAAFAAABEoAAAAAAAAAAAKAAYAoAIAAAAAgAAAAAAAAAoCCgAAAKKAAgCoAAIAAAAAAogigAAAAAUBRQAAFf/Z" name={"User"} />
          );
        })}

        {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}

        {currentUser && (
          <div className="relative ml-8 first:ml-0">
            <Avatar src={user?.picture!} name="You" />
          </div>
        )}
      </div>
    </main>
  );
}