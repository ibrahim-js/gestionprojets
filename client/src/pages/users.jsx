import { useState, useEffect } from "react";
import { Search, Edit, UserCog, UserPlus } from "lucide-react";
import moment from "moment/min/moment-with-locales";

import { Layout } from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { UserEditModal } from "@/components/user-edit-modal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader } from "@/components/loader";
import axios from "@/api/axios-instance";
import { useAuth } from "@/hooks/auth";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(null);

  const { user: loggedInUser, loading: userLoading } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/users");

      setUsers(response.data);

      setFilteredUsers(response.data);
    } catch (err) {
      setError("Impossible de charger la liste des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const termWords = searchTerm.toLowerCase().trim().split(/\s+/);

      const filtered = users.filter((user) => {
        const fullName = `${user.fname} ${user.lname}`.toLowerCase();

        return termWords.every((word) => fullName.includes(word));
      });

      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      const { data } = await axios.delete("/users", {
        data: { id: userToDelete.id },
      });

      fetchUsers();

      setSuccess(data.message);

      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError(
        "Erreur lors de la suppression de l'utilisateur. Veuillez réessayer."
      );
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Administrateur":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "Utilisateur":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "Utilisateur simple":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  if (userLoading) return <div></div>;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Gestion des Utilisateurs
          </h1>
          <Button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="mt-4 sm:mt-0 cursor-pointer"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>

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

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Rechercher un utilisateur par nom ou prénom..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              Aucun utilisateur trouvé
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Aucun utilisateur ne correspond à votre recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map(
              (user) =>
                user.id !== loggedInUser.id && (
                  <Card key={user.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                        <div className="flex space-x-1">
                          {user.role !== "Administrateur" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Modifier</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                <span className="sr-only">Supprimer</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {user.fname} {user.lname}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {user.poste_ormvag || ""}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <div>
                            <p>Ajouté le:</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {moment(user.created_at)
                                .locale("fr")
                                .format("D MMMM YYYY")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p>Dernière connexion:</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              25-12-2025
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
            )}
          </div>
        )}

        <UserEditModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          refreshUsers={fetchUsers}
        />

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Toutes les données associées à{" "}
                {userToDelete?.fname} {userToDelete?.lname} seront
                définitivement supprimées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={deleteLoading}
                className="cursor-pointer"
              >
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 cursor-pointer"
              >
                {deleteLoading ? (
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
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
