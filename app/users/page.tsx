"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  LogIn,
} from "lucide-react"
import { toast } from "sonner"
import { User, Plan, getFullName } from "@/types"
import { formatPlan, getPlanBadgeStyle } from "@/lib/plans"
import { getAllUsers, createUser, updateUser, getAllOrganizations } from "@/lib/api"
import { useEffect } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPlan, setFilterPlan] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showNewUserDialog, setShowNewUserDialog] = useState(false)
  
  // État pour le formulaire de modification
  const [editedUser, setEditedUser] = useState<User | null>(null)
  
  // État pour le formulaire de création
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    plan: "Free" as Plan,
    status: "active" as const,
  })

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const allUsers = await getAllUsers()
        setUsers(allUsers)
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error)
        toast.error("Erreur lors du chargement des utilisateurs")
      } finally {
        setIsLoading(false)
      }
    }
    loadUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const fullName = getFullName(user).toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan
    const matchesStatus = filterStatus === "all" || user.status === filterStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditedUser({ ...user }) // Créer une copie pour l'édition
    setShowUserDialog(true)
  }

  const handleSaveUser = async () => {
    if (!editedUser) return

    // Validation
    if (!editedUser.firstName || !editedUser.lastName || !editedUser.email) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Vérifier si l'email existe déjà pour un autre utilisateur
    const emailExists = users.some((u) => u.id !== editedUser.id && u.email === editedUser.email)
    if (emailExists) {
      toast.error("Cet email est déjà utilisé par un autre utilisateur")
      return
    }

    try {
      // Mettre à jour l'utilisateur via l'API
      const updatedUser = await updateUser(editedUser.id, {
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
        email: editedUser.email,
        company: editedUser.company,
        plan: editedUser.plan,
        status: editedUser.status,
      })

      // Mettre à jour l'utilisateur dans la liste
      setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
      
      // Fermer le dialog
      setShowUserDialog(false)
      setEditedUser(null)
      setSelectedUser(null)
      
      toast.success(`Utilisateur ${getFullName(updatedUser)} modifié avec succès`)
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur:", error)
      toast.error("Erreur lors de la modification de l'utilisateur")
    }
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? {
              ...u,
              status: u.status === "active" ? ("inactive" as const) : ("active" as const),
            }
          : u
      )
    )
    toast.success("Statut mis à jour")
  }

  const handleImpersonate = (user: User) => {
    // TODO: Implémenter la logique d'impersonation
    // Cela devrait générer un token d'impersonation et rediriger vers l'app principale
    toast.info(`Connexion en tant que ${getFullName(user)}...`, {
      description: "Redirection vers l'application principale",
    })
    // Exemple d'implémentation :
    // window.open(`https://app.spendbaker.com/auth/impersonate?token=${impersonationToken}`, '_blank')
  }

  const handleCreateUser = async () => {
    // Validation
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.company) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    // Vérifier si l'email existe déjà
    if (users.some((u) => u.email === newUser.email)) {
      toast.error("Cet email est déjà utilisé")
      return
    }

    try {
      // Créer l'utilisateur via l'API
      const createdUser = await createUser({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        company: newUser.company,
        plan: newUser.plan,
        status: newUser.status,
      })

      // Ajouter l'utilisateur à la liste
      setUsers([...users, createdUser])
      
      // Réinitialiser le formulaire
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        plan: "Free",
        status: "active",
      })
      
      // Fermer le dialog
      setShowNewUserDialog(false)
      
      toast.success(`Utilisateur ${getFullName(createdUser)} créé avec succès`)
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error)
      toast.error("Erreur lors de la création de l'utilisateur")
    }
  }

  const [organizationsList, setOrganizationsList] = useState<any[]>([])

  // Charger les organisations pour le select
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const orgs = await getAllOrganizations()
        setOrganizationsList(orgs)
      } catch (error) {
        console.error("Erreur lors du chargement des organisations:", error)
      }
    }
    loadOrganizations()
  }, [])

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Utilisateurs</h1>
            <p className="text-muted-foreground">
              Gérez les comptes utilisateurs et leurs abonnements
            </p>
          </div>
          <Button 
            className="btn-gradient"
            onClick={() => setShowNewUserDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les plans</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className="px-3 py-1">
                {filteredUsers.length} résultat{filteredUsers.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tableau */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>
              Tous les utilisateurs enregistrés sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement des utilisateurs...
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.firstName?.[0] || ""}{user.lastName?.[0] || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{getFullName(user)}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{user.company}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge style={getPlanBadgeStyle(user.plan)}>
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.status === "active" && (
                        <Badge
                          className="gap-1"
                          style={{
                            backgroundColor: "#10B981" + "20",
                            color: "#10B981",
                            border: "none",
                          }}
                        >
                          <CheckCircle className="w-3 h-3" />
                          Actif
                        </Badge>
                      )}
                      {user.status === "inactive" && (
                        <Badge
                          className="gap-1"
                          style={{
                            backgroundColor: "#EF4444" + "20",
                            color: "#EF4444",
                            border: "none",
                          }}
                        >
                          <XCircle className="w-3 h-3" />
                          Inactif
                        </Badge>
                      )}
                      {user.status === "pending" && (
                        <Badge
                          className="gap-1"
                          style={{
                            backgroundColor: "#F59E0B" + "20",
                            color: "#F59E0B",
                            border: "none",
                          }}
                        >
                          <Clock className="w-3 h-3" />
                          En attente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                            <LogIn className="w-4 h-4 mr-2" />
                            Se connecter en tant que
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            {user.status === "active" ? "Désactiver" : "Activer"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Utilisateur */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Profil Utilisateur
            </DialogTitle>
            <DialogDescription>
              Détails et paramètres de l'utilisateur
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Informations</TabsTrigger>
                <TabsTrigger value="activity">Activité</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 py-4">
                {editedUser && (
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-xl">
                        {editedUser.firstName?.[0] || ""}{editedUser.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label>Prénom *</Label>
                        <Input
                          value={editedUser.firstName}
                          onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Nom *</Label>
                        <Input
                          value={editedUser.lastName}
                          onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          value={editedUser.email}
                          type="email"
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Entreprise</Label>
                        <Input
                          value={editedUser.company}
                          onChange={(e) => setEditedUser({ ...editedUser, company: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Compte actif</Label>
                        <Switch
                          checked={editedUser.status === "active"}
                          onCheckedChange={(checked) =>
                            setEditedUser({
                              ...editedUser,
                              status: checked ? "active" : "inactive",
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="activity" className="py-4">
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Dernière connexion: Aujourd'hui à 14:32
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Compte créé:{" "}
                    {new Date(selectedUser.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => selectedUser && handleImpersonate(selectedUser)}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter en tant que
            </Button>
            <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowUserDialog(false)
                setEditedUser(null)
                setSelectedUser(null)
              }}
            >
              Annuler
            </Button>
            <Button className="btn-gradient" onClick={handleSaveUser}>
              Enregistrer
            </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Nouvel Utilisateur */}
      <Dialog open={showNewUserDialog} onOpenChange={setShowNewUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouvel utilisateur
            </DialogTitle>
            <DialogDescription>
              Créer un nouveau compte utilisateur
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                placeholder="Jean"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                placeholder="Dupont"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@example.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="company">Entreprise *</Label>
              <Select
                value={newUser.company}
                onValueChange={(value) => setNewUser({ ...newUser, company: value })}
              >
                <SelectTrigger id="company">
                  <SelectValue placeholder="Sélectionner une organisation" />
                </SelectTrigger>
                <SelectContent>
                  {organizationsList.map((org) => (
                    <SelectItem key={org.id} value={org.name}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="plan">Plan</Label>
              <Select
                value={newUser.plan}
                onValueChange={(value) => setNewUser({ ...newUser, plan: value as Plan })}
              >
                <SelectTrigger id="plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={newUser.status}
                onValueChange={(value) =>
                  setNewUser({
                    ...newUser,
                    status: value as "active" | "inactive" | "pending",
                  })
                }
              >
                <SelectTrigger id="status" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewUserDialog(false)
                setNewUser({
                  name: "",
                  email: "",
                  company: "",
                  plan: "Free",
                  status: "active",
                })
              }}
            >
              Annuler
            </Button>
            <Button className="btn-gradient" onClick={handleCreateUser}>
              Créer l'utilisateur
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
