import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

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

  const token = localStorage.getItem("access_token");

  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/notifications/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  async function markAsRead(id) {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n
    );
    setNotifications(updated);

    try {
      await fetch(`${API_BASE}/notifications/${id}/read/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function markAllAsRead() {
    for (let n of notifications) {
      if (!n.is_read) {
        await markAsRead(n.id);
      }
    }
  }

  useEffect(() => {
    fetchNotifications();
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
          Couldn't load notifications. Try again shortly.
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