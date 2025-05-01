import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function EditProjectForm({ project, onSave, onCancel }) {
  const [formData, setFormData] = useState({ ...project });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Modifier le projet</span>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{getFieldLabel(key)}</Label>
                <Input
                  id={key}
                  name={key}
                  value={value?.toString() || ""}
                  onChange={handleChange}
                  placeholder={`Entrez ${getFieldLabel(key).toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Fonction utilitaire pour obtenir des libellés plus lisibles pour les champs
function getFieldLabel(key) {
  const labels = {
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

  return labels[key] || key;
}
