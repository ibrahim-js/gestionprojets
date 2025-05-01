import express from "express";

import { fetchProjects, fetchProject } from "../controllers/projects.js";

const router = express.Router();

router.get("/", fetchProjects);

router.get("/:id", fetchProject);

export default router;
