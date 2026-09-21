import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Trash2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";
const POLL_INTERVAL_MS = 30000;

const TYPE_STYLES = {
  status_update: "bg-blue-50 border-l-4 border-l-blue-400",
  new_job_match: "bg-green-50 border-l-4 border-l-green-400",
  job_approval_update: "bg-amber-50 border-l-4 border-l-amber-400",
  system: "bg-gray-50 border-l-4 border-l-gray-300",
};

const TYPE_LABELS = {
  status_update: "Status Update",
  new_job_match: "New Job Match",
  job_approval_update: "Job Approval Update",
  system: "System",
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 0) return "just now";
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.floor(hours / 24);
  return days + "d ago";
}

function forceLogout() {
  // localStorage.removeItem("accessToken");
  // window.location.href = "/login";
}

function NotificationsPage() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true); // initial load / filter switch only
  const [refreshing, setRefreshing] = useState(false); // background polls — doesn't hide the list
  const [loadingMore, setLoadingMore] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  function authHeaders() {
    const token = localStorage.getItem("accessToken");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  const fetchUnreadCount = useCallback(async (signal) => {
    try {
      const res = await fetch(`${API_BASE}/notifications/unread-count/`, {
        headers: authHeaders(),
        signal,
      });
      if (res.status === 401) {
        forceLogout();
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unread_count);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Failed to refresh unread count:", err);
      }
    }
  }, []);

  const fetchNotifications = useCallback(
    async (currentFilter, signal, { background = false } = {}) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      try {
        const params = new URLSearchParams();
        if (currentFilter === "unread") params.set("is_read", "false");
        const res = await fetch(`${API_BASE}/notifications/?${params}`, {
          headers: authHeaders(),
          signal,
        });

        if (res.status === 401) {
          forceLogout();
          return;
        }
        if (!res.ok) {
          throw new Error("Something went wrong loading notifications.");
        }

        const data = await res.json();
        const results = Array.isArray(data) ? data : data.results;
        setNotifications(results ?? []);
        setNextPageUrl(Array.isArray(data) ? null : data.next);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          // Don't blow away the visible list with an error banner just
          // because a silent background poll failed — the user still has
          // their last-known-good data on screen.
          if (!background) setError(err.message);
        }
      } finally {
        if (background) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    []
  );

  async function loadMore() {
    if (!nextPageUrl) return;
    setLoadingMore(true);
    try {
      const res = await fetch(nextPageUrl, { headers: authHeaders() });
      if (res.status === 401) {
        forceLogout();
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNotifications((prev) => [...prev, ...(data.results ?? [])]);
      setNextPageUrl(data.next);
    } catch (err) {
      setError("Couldn't load more notifications.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function markAsRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/read/`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        forceLogout();
        return;
      }
      if (!res.ok) throw new Error();
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
      setUnreadCount((prev) => prev + 1);
    }
  }

  function handleNotificationClick(n) {
    if (!n.is_read) markAsRead(n.id);
    if (n.link) navigate(n.link);
  }

  async function deleteNotification(id) {
    const previous = notifications;
    const deletedNotif = notifications.find((n) => n.id === id);

    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (deletedNotif && !deletedNotif.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    try {
      const res = await fetch(`${API_BASE}/notifications/${id}/`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        forceLogout();
        return;
      }
      if (!res.ok) throw new Error();
    } catch (err) {
      setNotifications(previous);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount((prev) => prev + 1);
      }
      setError("Couldn't delete notification.");
    }
  }

  async function markAllAsRead() {
    const previouslyUnreadIds = new Set(
      notifications.filter((n) => !n.is_read).map((n) => n.id)
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      const res = await fetch(`${API_BASE}/notifications/mark-all-read/`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        forceLogout();
        return;
      }
      if (!res.ok) throw new Error();
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) =>
          previouslyUnreadIds.has(n.id) ? { ...n, is_read: false } : n
        )
      );
      setUnreadCount(previouslyUnreadIds.size);
    }
  }

  async function clearAllRead() {
    const readNotifications = notifications.filter((n) => n.is_read);
    if (readNotifications.length === 0) return;

    setClearing(true);
    setNotifications((prev) => prev.filter((n) => !n.is_read));

    try {
      const res = await fetch(`${API_BASE}/notifications/clear-read/`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        forceLogout();
        return;
      }
      if (!res.ok) throw new Error();
    } catch (err) {
      setNotifications((prev) => {
        const merged = [...prev, ...readNotifications];
        return merged.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });
      setError("Couldn't clear read notifications.");
    } finally {
      setClearing(false);
    }
  }

  const isFirstRun = useRef(true);
  const pollControllerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchNotifications(filter, controller.signal); // foreground — shows the spinner
    if (isFirstRun.current) {
      fetchUnreadCount(controller.signal);
      isFirstRun.current = false;
    }
    return () => controller.abort();
  }, [filter, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Cancel the previous tick's request if it's still in flight, so a
      // slow response can't resolve after a newer one and overwrite it
      // with stale data.
      pollControllerRef.current?.abort();
      const controller = new AbortController();
      pollControllerRef.current = controller;
      fetchNotifications(filter, controller.signal, { background: true }); // background — no spinner
      fetchUnreadCount(controller.signal);
    }, POLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      pollControllerRef.current?.abort();
    };
  }, [filter, fetchNotifications, fetchUnreadCount]);

  const hasRead = notifications.some((n) => n.is_read);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
          Notifications
          {refreshing && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
              aria-hidden="true"
            />
          )}
        </h1>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-colors"
            >
              <Check size={15} strokeWidth={2.5} />
              Mark all read
            </button>
          )}
          {hasRead && (
            <button
              onClick={clearAllRead}
              disabled={clearing}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              <Trash2 size={15} strokeWidth={2.5} />
              {clearing ? "Clearing..." : "Clear read"}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200" role="tablist">
        <button
          role="tab"
          aria-selected={filter === "all"}
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors focus:outline-none ${
            filter === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        <button
          role="tab"
          aria-selected={filter === "unread"}
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors focus:outline-none ${
            filter === "unread"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {loading && (
        <div className="py-16 text-center text-sm text-gray-500">
          Loading notifications...
        </div>
      )}

      {error && !loading && (
        <div className="py-4 mb-4 px-4 rounded-md bg-red-50 border border-red-100 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && notifications.length === 0 && !error && (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <Bell size={20} className="text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm text-gray-500">
            {filter === "unread"
              ? "You're all caught up!"
              : "No notifications yet."}
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`w-full px-4 py-4 rounded-md transition-shadow group ${
                  TYPE_STYLES[n.type] || "bg-white border-l-4 border-l-gray-200"
                } ${n.is_read ? "opacity-60" : "hover:shadow-sm"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    onClick={() => handleNotificationClick(n)}
                    aria-label={n.is_read ? n.message : `Unread: ${n.message}`}
                    className="flex items-start gap-2 text-left flex-1 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded"
                  >
                    {!n.is_read && (
                      <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                    )}
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {TYPE_LABELS[n.type] || n.type}
                      </span>
                      <p className="text-sm text-gray-800 mt-0.5">{n.message}</p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {timeAgo(n.created_at)}
                    </span>
                    <button
                      onClick={() => deleteNotification(n.id)}
                      aria-label="Delete notification"
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 rounded p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {nextPageUrl && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NotificationsPage;