import { useCallback, useEffect, useRef, useState } from "react";
import { notifyChanged, request } from "./notificationsApi";

const POLL_INTERVAL_MS = 30000;

export function useNotificationList(filter, { unreadCount, adjustUnread }) {
  const [notifications, setNotifications] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loading, setLoading] = useState(true); // first load / filter switch
  const [refreshing, setRefreshing] = useState(false); // background polls
  const [loadingMore, setLoadingMore] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);

  const fetchList = useCallback(
    async (signal, background = false) => {
      const setBusy = background ? setRefreshing : setLoading;
      setBusy(true);
      try {
        const query = filter === "unread" ? "?is_read=false" : "";
        const data = await request(`/notifications/${query}`, { signal });
        const results = (Array.isArray(data) ? data : data.results) ?? [];

        if (background) {
          // a poll only adds brand-new items and keeps pages loaded with "Load more"
          setNotifications((prev) => {
            const known = new Set(prev.map((n) => n.id));
            return [...results.filter((n) => !known.has(n.id)), ...prev];
          });
        } else {
          setNotifications(results);
          setNextPageUrl(Array.isArray(data) ? null : data.next);
        }
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError" && !background) {
          setError("Something went wrong loading notifications.");
        }
      } finally {
        if (signal?.aborted) return; // a newer request owns the loading state
        setBusy(false);
      }
    },
    [filter]
  );

  const setRead = (id, is_read) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read } : n)));

  async function loadMore() {
    if (!nextPageUrl) return;
    setLoadingMore(true);
    try {
      const data = await request(nextPageUrl);
      setNotifications((prev) => {
        const known = new Set(prev.map((n) => n.id));
        return [...prev, ...(data.results ?? []).filter((n) => !known.has(n.id))];
      });
      setNextPageUrl(data.next);
    } catch {
      setError("Couldn't load more notifications.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function markAsRead(id) {
    setRead(id, true);
    adjustUnread(-1);
    try {
      await request(`/notifications/${id}/read/`, { method: "PATCH" });
      notifyChanged();
    } catch {
      setRead(id, false);
      adjustUnread(1);
    }
  }

  async function deleteNotification(id) {
    const previous = notifications;
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.is_read) adjustUnread(-1);
    try {
      await request(`/notifications/${id}/`, { method: "DELETE" });
      notifyChanged();
    } catch {
      setNotifications(previous);
      if (target && !target.is_read) adjustUnread(1);
      setError("Couldn't delete notification.");
    }
  }

  async function markAllAsRead() {
    const unreadIds = new Set(notifications.filter((n) => !n.is_read).map((n) => n.id));
    const previousCount = unreadCount;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    adjustUnread(-previousCount);
    try {
      await request("/notifications/mark-all-read/", { method: "PATCH" });
      notifyChanged();
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (unreadIds.has(n.id) ? { ...n, is_read: false } : n))
      );
      adjustUnread(previousCount);
      setError("Couldn't mark all as read.");
    }
  }

  async function clearAllRead() {
    const read = notifications.filter((n) => n.is_read);
    if (!read.length) return;
    setClearing(true);
    setNotifications((prev) => prev.filter((n) => !n.is_read));
    try {
      await request("/notifications/clear-read/", { method: "DELETE" });
    } catch {
      setNotifications((prev) =>
        [...prev, ...read].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
      setError("Couldn't clear read notifications.");
    } finally {
      setClearing(false);
    }
  }

  // list: loaded on mount and whenever the filter changes
  useEffect(() => {
    const controller = new AbortController();
    fetchList(controller.signal);
    return () => controller.abort();
  }, [fetchList]);

  // list: background polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      pollRef.current?.abort(); // drop a slow request from the previous tick
      const controller = new AbortController();
      pollRef.current = controller;
      fetchList(controller.signal, true);
    }, POLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      pollRef.current?.abort();
      setRefreshing(false); // an aborted poll cannot leave the pulse dot stuck on
    };
  }, [fetchList]);

  return {
    notifications,
    hasMore: Boolean(nextPageUrl),
    loading,
    refreshing,
    loadingMore,
    clearing,
    error,
    loadMore,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    clearAllRead,
  };
}