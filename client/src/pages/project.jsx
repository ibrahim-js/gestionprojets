import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Edit, FileText, Download, Eye } from "lucide-react";

import { getProject, setProject, setLoading } from "@/store/project-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { FileViewer } from "@/components/file-viewer";
import { EditProjectForm } from "@/components/edit-project-form";

export default function ProjectDetailsPage() {
  const { type, id } = useParams();

  const navigate = useNavigate();

  const [showFileViewer, setShowFileViewer] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { project, loading } = useSelector((state) => state.project);

  useEffect(() => {
    const existingProject = projects.find((p) => p["id"] == id);

    if (existingProject) {
      dispatch(setProject(existingProject));

      dispatch(setLoading(false));
    } else {
      dispatch(getProject({ type, id }));
    }
  }, [id, type, dispatch, projects]);

  const handleGoBack = () => {
    navigate("/projects");
  };

  const handleViewFile = (file) => {
    setFile(file);

    setShowFileViewer(true);
  };

  const handleEditProject = () => {
    setShowEditForm(true);
  };

  const handleUpdateProject = (updatedProject) => {
    setProject(updatedProject);
    setShowEditForm(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-b-gray-900"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Projet non trouvé
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Le projet avec l'identifiant {id} n'existe pas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="mb-4 sm:mb-0"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          {/* <div className="flex space-x-2">
            <Button onClick={handleEditProject}>
              <Edit className="mr-2 h-4 w-4" /> Modifier
            </Button>
          </div> */}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              {project.projectTitle || "Détails du projet"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(project).map(
                ([key, value]) =>
                  getFieldLabel(type, key) && (
                    <div key={key} className="space-y-1">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {getFieldLabel(type, key)}
                      </h3>
                      <p className="text-base font-medium">
                        {value?.toString() || "-"}
                      </p>
                    </div>
                  )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Fichier associé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4 flex-wrap p-6 border-2 border-dashed rounded-lg">
              {project.attachedFiles.length > 0 ? (
                project.attachedFiles.map((file, index) => (
                  <div
                    className="flex flex-col items-center justify-center"
                    key={index}
                  >
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Fichier: <span className="font-medium">{file}</span>
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handleViewFile(file)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> Voir
                      </Button>
                      <Button variant="outline" asChild>
                        <a
                          href={`${
                            import.meta.env.VITE_BASE_API_URL
                          }/files/${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" /> Télécharger
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun fichier associé trouvé.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {showFileViewer && (
          <FileViewer file={file} onClose={() => setShowFileViewer(false)} />
        )}

        {showEditForm && (
          <EditProjectForm
            project={project}
            onSave={handleUpdateProject}
            onCancel={() => setShowEditForm(false)}
          />
        )}
      </div>
    </Layout>
  );
}

function getFieldLabel(type, key) {
  let labels;
  if (type == "1") {
    labels = {
      INDICE: "Indice",
      EPI: "EPI",
      AR: "AR",
      ET: "ET",
      "N° Boite": "N° Boite",
      "Intitulé du Projet": "Intitulé du projet",
      Etude: "Étude",
      Date: "Date",
      Secteur: "Secteur",
      TI: "TI",
      "titre du documemt": "Titre du document",
      "Nbre des documents A3": "Nbre des documents A3",
      "Nbre des documents A4": "Nbre des documents A4",
      "Nbre des plans": "Nbre des plans",
      "TYPE DE DOCUMENT A4": "Type de document A4",
      "TYPE DE DOCUMENT A3": "Type de document A3",
      "TYPE DE DOCUMENT A0": "Type de document A0",
      "Nbre des copies": "Nbre des copies",
      "Nbre des examplaire": "Nbre des exemplaires",
      "N° DOSSIER": "N° dossier",
      Salle: "Salle",
    };
  } else {
    labels = {
      indice: "Indice",
      NOM: "Nom",
      "Nature du plan": "Nature du plan",
      "type d'ouvrage / réseau": "Type d'ouvrage / réseau",
      feuille: "Feuille",
      Secteur: "Secteur",
      realisateur: "Réalisateur",
      Echelle: "Échelle",
      mappe: "Mappe",
      Annee: "Année",
      "tranche d'irrigation": "Tranche d'irrigation",
    };
  }

  return labels[key] || null;
}
