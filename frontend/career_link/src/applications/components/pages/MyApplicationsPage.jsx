import React from "react";

function MyApplicationsPage() {
  const applications = [
    { id: 1, jobTitle: "Frontend Developer", company: "TechNova", status: "Pending" },
    { id: 2, jobTitle: "UI/UX Intern", company: "Designify", status: "Accepted" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Applications</h1>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app.id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold">{app.jobTitle}</h2>
            <p className="text-gray-600">{app.company}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                app.status === "Accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplicationsPage;