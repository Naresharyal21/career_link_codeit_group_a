import React from "react";

function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      message: "Your application to EvrestHire was Accepted",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      message: "EvrestHire viewed your application",
      time: "1 day ago",
      isRead: true,
    },
    {
      id: 3,
      message: "Your application to EvrestHire was Accepted",
      time: "2 days ago",
      isRead: true,
    },
  ];

  function getBoxColor(isRead) {
    if (isRead) {
      return "bg-gray-50";
    } else {
      return "bg-blue-50 border-blue-300";
    }
  }

  function getTextStyle(isRead) {
    if (isRead) {
      return "text-gray-700";
    } else {
      return "font-semibold text-gray-900";
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      <div className="space-y-3">
        {notifications.map((item) => {
          return (
            <div
              key={item.id}
              className={"border rounded-lg p-4 shadow-sm " + getBoxColor(item.isRead)}
            >
              <p className={getTextStyle(item.isRead)}>{item.message}</p>
              <span className="text-sm text-gray-500">{item.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NotificationsPage;