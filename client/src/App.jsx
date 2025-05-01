import { Routes, Route } from "react-router-dom";

import Projects from "@/pages/projects";
import ProjectDetailsPage from "@/pages/project";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import Protect from "@/components/protect";

export default function App() {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <Protect>
            <Dashboard />
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
