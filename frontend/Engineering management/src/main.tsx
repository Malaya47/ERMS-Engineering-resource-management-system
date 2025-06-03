import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./features/auth/Login";
import DashboardLayout from "./layouts/DashboardLayout";

import TeamOverview from "./pages/manager/TeamOverview";
import CreateAssignment from "./pages/manager/CreateAssignment";
import ProjectManagement from "./pages/manager/ProjectManagement";

import MyAssignments from "./pages/engineer/MyAssignments";
import Profile from "./pages/engineer/Profile";

import "./index.css"; // Assuming you have a CSS file for global styles

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />, // Shared layout
    children: [
      // Manager routes
      { path: "manager/team", element: <TeamOverview /> },
      { path: "manager/assignments", element: <CreateAssignment /> },
      { path: "manager/projects", element: <ProjectManagement /> },

      // Engineer routes
      { path: "engineer/assignments", element: <MyAssignments /> },
      { path: "engineer/profile", element: <Profile /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
