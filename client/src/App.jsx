import { Routes, Route } from "react-router-dom";

import Projects from "@/pages/projects";
import ProjectDetailsPage from "@/pages/project";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import ProfilePage from "@/pages/profile";
import UsersPage from "@/pages/users";
import Protect from "@/components/protect";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protect>
            <Dashboard />
          </Protect>
        }
      />
      <Route
        path="/profil"
        element={
          <Protect>
            <ProfilePage />
          </Protect>
        }
      />
      <Route
        path="/utilisateurs"
        element={
          <Protect allowedRoles={["Administrateur"]}>
            <UsersPage />
          </Protect>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route
        path="/projects"
        element={
          <Protect>
            <Projects />
          </Protect>
        }
      />
      <Route
        path="/projects/:type/:id"
        element={
          <Protect>
            <ProjectDetailsPage />
          </Protect>
        }
      />
    </Routes>
  );
}
