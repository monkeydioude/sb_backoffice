"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getFullName } from "@/types"
import {
    Activity,
    ArrowLeft,
    Building2,
    CheckCircle,
    Clock,
    Edit,
    LogIn,
    Mail,
    XCircle
} from "lucide-react"
import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"

// Données d'exemple pour un utilisateur
const getUserData = (id: string) => {
  const users: Record<string, any> = {
    "1": {
      id: "1",
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@company.com",
      company: "TechCorp",
      plan: "Pro",
      status: "active",
      mrr: 0,
      createdAt: "2024-01-15",
      phone: "+33 6 12 34 56 78",
      address: "123 Rue de la Tech, 75001 Paris",
      lastLogin: "Aujourd'hui à 14:32",
      totalExpenses: 45000,
      activeProjects: 5,
    },
  }
  return users[id] || users["1"]
}

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const initialUser = getUserData(userId)
  const [editedUser, setEditedUser] = useState(initialUser)
  const [isEditing, setIsEditing] = useState(false)

  const handleImpersonate = () => {
    // TODO: Implémenter la logique d'impersonation
    // Cela devrait générer un token d'impersonation et rediriger vers l'app principale
    toast.info(`Connexion en tant que ${getFullName(editedUser)}...`, {
      description: "Redirection vers l'application principale",
    })
    // Exemple d'implémentation :
    // window.open(`https://app.spendbaker.com/auth/impersonate?token=${impersonationToken}`, '_blank')
  }

  const handleSave = () => {
    // Validation
    if (!editedUser.firstName || !editedUser.lastName || !editedUser.email) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Ici, vous devriez normalement appeler une API pour sauvegarder
    // Pour l'instant, on simule juste la sauvegarde
    setIsEditing(false)
    toast.success(`Utilisateur ${getFullName(editedUser)} modifié avec succès`)
  }

  const handleCancel = () => {
    setEditedUser(initialUser)
    setIsEditing(false)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4">
          <Link to="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Détails de l'utilisateur</h1>
            <p className="text-muted-foreground">
              Informations complètes sur {getFullName(editedUser)}
            </p>
          </div>
        </div>

        {/* Profil utilisateur */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte principale */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarFallback className="text-2xl">
                      { editedUser.firstName?.[0] || ""}{editedUser.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{getFullName(editedUser)}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {editedUser.email}
                    </CardDescription>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Annuler
                      </Button>
                      <Button className="btn-gradient" onClick={handleSave}>
                        Enregistrer
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="activity">Activité</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Prénom *</Label>
                        <Input
                          value={editedUser.firstName}
                          onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Nom *</Label>
                        <Input
                          value={editedUser.lastName}
                          onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Email *</Label>
                        <Input
                          value={editedUser.email}
                          type="email"
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Téléphone</Label>
                        <Input
                          value={editedUser.phone || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Entreprise</Label>
                        <Input
                          value={editedUser.company}
                          onChange={(e) => setEditedUser({ ...editedUser, company: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label>Adresse</Label>
                        <Input
                          value={editedUser.address || ""}
                          onChange={(e) => setEditedUser({ ...editedUser, address: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center justify-between col-span-2">
                        <Label>Compte actif</Label>
                        <Switch
                          checked={editedUser.status === "active"}
                          onCheckedChange={(checked) =>
                            setEditedUser({
                              ...editedUser,
                              status: checked ? "active" : "inactive",
                            })
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="py-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Dernière connexion</p>
                          <p className="text-sm text-muted-foreground">
                            {editedUser.lastLogin}
                          </p>
                        </div>
                        <Activity className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Compte créé</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(editedUser.createdAt).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Projets actifs</p>
                          <p className="text-sm text-muted-foreground">
                            {editedUser.activeProjects || 0} projets
                          </p>
                        </div>
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec statut et actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editedUser.status === "active" ? (
                  <Badge
                    className="gap-1 w-full justify-center py-2"
                    style={{
                      backgroundColor: "#10B981" + "20",
                      color: "#10B981",
                      border: "none",
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Actif
                  </Badge>
                ) : (
                  <Badge
                    className="gap-1 w-full justify-center py-2"
                    style={{
                      backgroundColor: "#EF4444" + "20",
                      color: "#EF4444",
                      border: "none",
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Inactif
                  </Badge>
                )}

                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="default" 
                    className="w-full btn-gradient"
                    onClick={handleImpersonate}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Se connecter en tant que
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier le profil
                  </Button>
                  <Button variant="destructive" className="w-full">
                    <XCircle className="w-4 h-4 mr-2" />
                    Désactiver le compte
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Entreprise:</span>
                  <span className="font-medium">{editedUser.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{editedUser.plan}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
