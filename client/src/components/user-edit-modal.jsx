import { useEffect, useState } from "react";
import { Save, AlertCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "@/api/axios-instance";

export function UserEditModal({ user, isOpen, onClose, refreshUsers }) {
  const [formData, setFormData] = useState({
    id: "",
    fname: "",
    lname: "",
    email: "",
    poste_ormvag: "",
    role: "Utilisateur",
    created_at: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        id: "",
        fname: "",
        lname: "",
        email: "",
        poste_ormvag: "",
        role: "Utilisateur",
        created_at: "",
      });
    }
    setPassword("");
  }, [user]);

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (
        !formData.fname ||
        !formData.lname ||
        !formData.email ||
        !formData.poste_ormvag
      ) {
        return setError("Tous les champs sont obligatoires");
      }

      if (!user && !password) {
        return setError(
          "Le mot de passe est obligatoire pour un nouvel utilisateur"
        );
      }

      const updatedUser = {
        ...formData,
        password,
      };

      if (updatedUser.id) {
        try {
          const { data } = await axios.put("/users", updatedUser);

          setSuccess(data.message);

          refreshUsers();
        } catch (error) {
          setError(error.response.data.message || error.message);
        }
      } else {
        try {
          const { data } = await axios.post("/users", updatedUser);

          setSuccess(data.message);

          refreshUsers();
        } catch (error) {
          setError(error.response.data.message || error.message);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la mise à jour"
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="Prénom"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Nom"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {user
                ? "Mot de passe (laisser vide pour ne pas modifier)"
                : "Mot de passe"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              required={!user}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="posteOrmvag">Poste ORMVAG</Label>
            <Input
              id="posteOrmvag"
              name="poste_ormvag"
              value={formData.poste_ormvag || ""}
              onChange={handleChange}
              placeholder="Poste ORMVAG"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger id="role" className="cursor-pointer">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrateur" className="cursor-pointer">
                  Administrateur
                </SelectItem>
                <SelectItem value="Utilisateur" className="cursor-pointer">
                  Utilisateur
                </SelectItem>
                <SelectItem
                  value="Utilisateur simple"
                  className="cursor-pointer"
                >
                  Utilisateur simple
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="cursor-pointer"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {user ? "Enregistrement..." : "Ajout..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {user ? "Enregistrer" : "Ajouter"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
