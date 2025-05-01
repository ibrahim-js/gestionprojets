import { useState, useEffect } from "react";
import { X, Download, FileText, ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PDFViewer } from "@/components/pdf-viewer";

export function FileViewer({ file, onClose }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const fileExtension = file?.split(".")[1];

        const url = `${import.meta.env.VITE_BASE_API_URL}/files/${file}`;

        setFileUrl(url);
        setFileType(fileExtension);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement du fichier:", err);
        setError(
          "Impossible de charger le fichier. Veuillez réessayer plus tard."
        );
        setLoading(false);
      }
    };

    if (file) {
      fetchFile();
    }
  }, [file]);

  // Fonction pour rendre le contenu du fichier en fonction de son type
  const renderFileContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-transparent border-b-gray-900"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col justify-center items-center h-96">
          <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (fileType === "pdf") {
      return (
        <div className="h-[70vh] w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center">
          {/* <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Aperçu PDF pour {file}
          </p> */}
          <PDFViewer url={fileUrl} />
          {/* <Button variant="outline" asChild>
            <a href={fileUrl || "#"} target="_blank" rel="noopener noreferrer">
              Ouvrir dans un nouvel onglet
            </a>
          </Button> */}
        </div>
      );
    } else if (
      fileType === "jpg" ||
      fileType === "png" ||
      fileType === "jpeg"
    ) {
      return (
        <div className="h-[70vh] bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center">
          <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Aperçu image pour {file}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            <img src={fileUrl} alt="Image" />
          </p>
          <Button variant="outline" asChild>
            <a href={fileUrl || "#"} target="_blank" rel="noopener noreferrer">
              Ouvrir dans un nouvel onglet
            </a>
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center h-96">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          Type de fichier non pris en charge
        </p>
      </div>
    );
  };

  // return (
  //   <Dialog open={true} onOpenChange={onClose}>
  //     <DialogContent className="w-[700px] max-w-[700px]">
  //       <DialogHeader>
  //         <DialogTitle className="px-8 flex justify-between items-center">
  //           <span>Visualisation du fichier: {file}</span>
  //           {/* <div className="flex space-x-2">
  //             <Button variant="outline" size="sm" asChild>
  //               <a href={fileUrl || "#"} download>
  //                 <Download className="h-4 w-4 mr-2" /> Télécharger
  //               </a>
  //             </Button>
  //           </div> */}
  //         </DialogTitle>
  //       </DialogHeader>
  //       <div className="mt-4 w-full">{renderFileContent()}</div>
  //     </DialogContent>
  //   </Dialog>
  // );

  return (
    <div className="fixed inset-0 flex items-center z-[1000] justify-center backdrop-blur-xs bg-black/10">
      <div className="bg-white rounded-lg shadow-lg border h-[90vh] w-[calc(100%-5rem)]">
        <div className="w-full py-6 px-8 flex items-center justify-between">
          <h1 className="font-semibold text-lg">
            Visualisation du fichier: {file}
          </h1>

          <Button variant="ghost" className="h-8 w-8" onClick={onClose}>
            <X />
          </Button>
        </div>

        <div className="w-full px-4">{renderFileContent()}</div>
      </div>
    </div>
  );
}
