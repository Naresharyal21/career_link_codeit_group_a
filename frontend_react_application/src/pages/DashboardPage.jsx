import React, { useState, useEffect } from 'react';
import { getApplications } from '../api';

const DashboardPage = () => {
  const role = sessionStorage.getItem('role');
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getApplications();
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="p-margin-desktop bg-surface min-h-screen">
      <h1 className="text-headline-lg text-surface-tint">Dashboard</h1>
      <p className="mt-md text-body-lg">Welcome! Your role is: <strong className="text-secondary">{role === 'ep' ? 'Employer' : 'Job Seeker'}</strong></p>
      
      <div className="mt-lg">
        <h2 className="text-headline-md">Your Applications</h2>
        <div className="mt-md grid gap-sm">
          {applications.length > 0 ? (
            applications.map(app => (
                <div key={app.id} className="p-sm bg-surface-container-low rounded-md border border-outline-variant">
                    <p className="font-semibold">{app.job_title}</p>
                    <p className="text-sm text-on-surface-variant">Status: {app.status}</p>
                </div>
            ))
          ) : (
            <p className="text-on-surface-variant">No applications found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
