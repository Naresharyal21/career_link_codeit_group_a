import { useCallback, useEffect, useState } from "react";
import { request } from "./notificationsApi";

const POLL_INTERVAL_MS = 30000;

export function useUnreadCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async (signal) => {
    if (!localStorage.getItem("accessToken")) return;
    try {
      const data = await request("/notifications/unread-count/", { signal });
      setUnreadCount(data.unread_count || 0);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Failed to refresh unread count:", err);
    }
  }, []);

  // Instant change before the server answers: +1, -1, or -previousCount
  const adjustUnread = useCallback(
    (delta) => setUnreadCount((count) => Math.max(0, count + delta)),
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    const refetch = () => refresh(controller.signal);

    refetch();
    const interval = setInterval(() => {
      if (!document.hidden) refetch();
    }, POLL_INTERVAL_MS);
    window.addEventListener("notifications:changed", refetch);

    return () => {
      controller.abort();
      clearInterval(interval);
      window.removeEventListener("notifications:changed", refetch);
    };
  }, [refresh]);

  return { unreadCount, adjustUnread };
}