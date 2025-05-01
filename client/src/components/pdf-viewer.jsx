import { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PDFViewer({ url }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Simuler le chargement du PDF
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [url]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm">Zoom: {Math.round(zoom * 100)}%</div>
      </div>

      <div className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-700 p-4">
        <div
          className="mx-auto bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            width: "100%",
            height: "100%",
            maxWidth: "800px",
          }}
        >
          {/* Dans une vraie application, vous utiliseriez une bibliothèque comme react-pdf */}
          <iframe
            src={url}
            className="w-full h-full"
            title="PDF Viewer"
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
