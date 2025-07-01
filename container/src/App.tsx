import React, { Suspense, lazy } from "react";
const RemoteDashboard = lazy(() => import("dashboard/DashboardApp"));
const RemoteAuth = lazy(() => import("auth/AuthApp"));

const App = () => {
  return (
    <div className="p-4 text-center text-xl text-blue-600">
      <h1>Container App</h1>
      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <RemoteDashboard />
      </Suspense>
      <Suspense fallback={<div>Loading Auth...</div>}>
        <RemoteAuth />
      </Suspense>
    </div>
  );
};

export default App;
