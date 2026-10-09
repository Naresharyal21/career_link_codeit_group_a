import { useState } from "react";
import { Check, Trash2, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { useNotificationList } from "../../hooks/useNotificationList";

const TYPES = {
  status_update: { label: "Status Update", style: "bg-blue-50 border-l-4 border-l-blue-400" },
  new_job_match: { label: "New Job Match", style: "bg-green-50 border-l-4 border-l-green-400" },
  job_approval_update: {
    label: "Job Approval Update",
    style: "bg-amber-50 border-l-4 border-l-amber-400",
  },
  system: { label: "System", style: "bg-gray-50 border-l-4 border-l-gray-300" },
};

const TABS = [
  ["all", "All"],
  ["unread", "Unread"],
];

function timeAgo(dateString) {
  const minutes = Math.floor((Date.now() - new Date(dateString)) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function NotificationsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const unread = useUnreadCount();
  const { unreadCount } = unread;
  const {
    notifications,
    hasMore,
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
  } = useNotificationList(filter, unread);

  const hasRead = notifications.some((n) => n.is_read);

  function handleClick(n) {
    if (!n.is_read) markAsRead(n.id);
    if (n.link) navigate(n.link);
  }

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
        {TABS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors focus:outline-none ${
              filter === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {label} {key === "unread" && unreadCount > 0 && `(${unreadCount})`}
          </button>
        ))}
      </div>

      {loading && (
        <div className="py-16 text-center text-sm text-gray-500">Loading notifications...</div>
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
            {filter === "unread" ? "You're all caught up!" : "No notifications yet."}
          </p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <>
          <div className="space-y-2">
            {notifications.map((n) => {
              const type = TYPES[n.type];
              return (
                <div
                  key={n.id}
                  className={`w-full px-4 py-4 rounded-md transition-shadow group ${
                    type?.style || "bg-white border-l-4 border-l-gray-200"
                  } ${n.is_read ? "opacity-60" : "hover:shadow-sm"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => handleClick(n)}
                      aria-label={n.is_read ? n.message : `Unread: ${n.message}`}
                      className="flex items-start gap-2 text-left flex-1 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded"
                    >
                      {!n.is_read && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {type?.label || n.type}
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
                        className="sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 text-gray-400 hover:text-red-500 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 rounded p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
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