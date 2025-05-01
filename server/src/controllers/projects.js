import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import db from "../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleExtensions = [".pdf", ".jpeg", ".jpg", ".png"];
const filesDir = path.join(__dirname, "../files");

export async function fetchProjects(req, res) {
  const { type } = req.query;

  if (type !== "projects1" && type !== "projects2") {
    return res.status(400).json({ error: "Invalid type" });
  }

  const table = type == "projects1" ? "projets" : "projets2";
  const indice = type == "projects1" ? "INDICE" : "indice";

  try {
    const result = await db.query(`SELECT * FROM ${table}`);

    const projectsWithFiles = result.rows.map((project) => {
      const attachedFiles = [];

      for (const ext of possibleExtensions) {
        const filePath = path.join(filesDir, `${project[indice]}${ext}`);
        if (fs.existsSync(filePath)) {
          attachedFiles.push(`${project[indice]}${ext}`);
        }
      }

      return {
        ...project,
        attachedFiles,
      };
    });

    res.json(projectsWithFiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function fetchProject(req, res) {
  const { type } = req.query;
  const { id } = req.params;

  if (type !== "projects1" && type !== "projects2") {
    return res.status(400).json({ error: "Invalid type" });
  }

  const table = type == "projects1" ? "projets" : "projets2";
  const indice = type == "projects1" ? "INDICE" : "indice";

  try {
    const result = await db.query(`SELECT * FROM ${table} WHERE "id" = $1`, [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Projet non trouvé" });
    }

    const project = result.rows[0];

    const attachedFiles = [];

    for (const ext of possibleExtensions) {
      const filePath = path.join(filesDir, `${project[indice]}${ext}`);

      if (fs.existsSync(filePath)) {
        attachedFiles.push(`${project[indice]}${ext}`);
      }
    }

    res.json({
      ...project,
      attachedFiles,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
