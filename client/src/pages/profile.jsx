import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Save,
  Key,
  Mail,
  Building,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import axios from "@/api/axios-instance";

export default function ProfilePage() {
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    fname: "",
    lname: "",
    email: "",
    poste_ormvag: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!userLoading) {
      setProfile({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        poste_ormvag: user.poste_ormvag,
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.put("/users/profile", profile);

      setSuccess(response.data.message);

      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => {
        navigate(0);
      }, 2000);
    } catch (err) {
      setSuccess(err.message || response.data.message);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const response = await axios.put("/users/profile", passwordData);

      setSuccess(response.data.message);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setError(error.response.data.message || error.message);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Mon Profil
          </h1>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="informations" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="informations">
              Informations Personnelles
            </TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="informations">
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations personnelles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} id="profile-form">
                  <div className="grid gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <h3 className="text-lg font-medium">Identité</h3>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            name="fname"
                            value={profile.fname}
                            onChange={handleProfileChange}
                            placeholder="Prénom"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input
                            id="lastName"
                            name="lname"
                            value={profile.lname}
                            onChange={handleProfileChange}
                            placeholder="Nom"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <h3 className="text-lg font-medium">Coordonnées</h3>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            placeholder="votre@email.com"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <h3 className="text-lg font-medium">
                          Informations Professionnelles
                        </h3>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="posteOrmvag">Poste ORMVAG</Label>
                          <Input
                            id="posteOrmvag"
                            name="poste_ormvag"
                            value={profile.poste_ormvag}
                            onChange={handleProfileChange}
                            placeholder="Votre poste"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" form="profile-form" disabled={loading}>
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
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Sécurité</CardTitle>
                <CardDescription>
                  Mettez à jour votre mot de passe. Pour des raisons de
                  sécurité, veuillez entrer votre mot de passe actuel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} id="password-form">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-500" />
                        <h3 className="text-lg font-medium">
                          Changer de mot de passe
                        </h3>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-1 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Mot de passe actuel
                          </Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">
                            Nouveau mot de passe
                          </Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Le mot de passe doit contenir au moins 8 caractères
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirmer le nouveau mot de passe
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" form="password-form" disabled={loading}>
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
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Mettre à jour le mot de passe
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
