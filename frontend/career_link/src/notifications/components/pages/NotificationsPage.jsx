import { useCallback, useEffect, useState } from "react";
import apiClient from "../../../apis/apiClient";

const TYPE_STYLES = {
  status_update: "bg-blue-50 border-l-4 border-l-blue-400",
  new_job_match: "bg-green-50 border-l-4 border-l-green-400",
  system: "bg-gray-50 border-l-4 border-l-gray-300",
};

const TYPE_LABELS = {
  status_update: "Status Update",
  new_job_match: "New Job Match",
  system: "System",
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + "m ago";

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h ago";

  const days = Math.floor(hours / 24);
  return days + "d ago";
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get("/notifications/");
      setNotifications(Array.isArray(data) ? data : data?.results || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  async function markAsRead(id) {
    const original = notifications.find((notification) => notification.id === id);
    if (!original || original.is_read) return;
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, is_read: true } : notification
      )
    );
    try {
      await apiClient.patch(`/notifications/${id}/read/`);
    } catch (err) {
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? original : notification
        )
      );
      setError(err.message || "Could not mark this notification as read.");
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((notification) => !notification.is_read);
    if (!unread.length) return;
    setError(null);
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, is_read: true }))
    );
    const results = await Promise.allSettled(
      unread.map((notification) =>
        apiClient.patch(`/notifications/${notification.id}/read/`)
      )
    );
    const failedIds = new Set(
      results.flatMap((result, index) =>
        result.status === "rejected" ? [unread[index].id] : []
      )
    );
    if (failedIds.size > 0) {
      setNotifications((current) =>
        current.map((notification) =>
          failedIds.has(notification.id)
            ? { ...notification, is_read: false }
            : notification
        )
      );
      setError(
        failedIds.size === unread.length
          ? "Could not mark notifications as read."
          : `Marked ${unread.length - failedIds.size} notifications as read; ${failedIds.size} could not be updated.`
      );
    }
  }

  useEffect(() => {
    let active = true;
    apiClient
      .get("/notifications/")
      .then((data) => {
        if (active) {
          setNotifications(Array.isArray(data) ? data : data?.results || []);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  let visibleNotifications = notifications;
  if (filter === "unread") {
    visibleNotifications = notifications.filter((n) => !n.is_read);
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-blue-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-200">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            filter === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
            filter === "unread"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
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
        <div className="py-16 text-center text-sm text-red-600">
          <p>{error === "Failed to fetch" ? "Couldn't load notifications." : error}</p>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              fetchNotifications();
            }}
            className="mt-2 font-semibold underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && visibleNotifications.length === 0 && (
        <div className="py-16 text-center text-sm text-gray-500">
          {filter === "unread"
            ? "You're all caught up!"
            : "No notifications yet."}
        </div>
      )}

      {!loading && !error && visibleNotifications.length > 0 && (
        <div className="space-y-2">
          {visibleNotifications.map((n) => (
            <button
              key={n.id}
              onClick={() => !n.is_read && markAsRead(n.id)}
              className={`w-full text-left px-4 py-4 rounded-md ${
                TYPE_STYLES[n.type] || "bg-white border-l-4 border-l-gray-200"
              } ${n.is_read ? "opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  {!n.is_read && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {TYPE_LABELS[n.type] || n.type}
                    </span>
                    <p className="text-sm text-gray-800 mt-0.5">{n.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {timeAgo(n.created_at)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
