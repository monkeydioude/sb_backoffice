"use client"

import { useState } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  Building2, 
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  XCircle,
  Euro
} from "lucide-react"
import { Organization, Plan, SubscriptionType, User, getFullName } from "@/types"
import { formatPlan, getPlanBadgeStyle } from "@/lib/plans"
import { calculateMRR } from "@/types"
import { Switch } from "@/components/ui/switch"
import { 
  getAllOrganizations, 
  createOrganization, 
  updateOrganization 
} from "@/lib/api"
import { useEffect } from "react"

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPlan, setFilterPlan] = useState<string>("all")
  const [showNewOrgDialog, setShowNewOrgDialog] = useState(false)
  const [showEditOrgDialog, setShowEditOrgDialog] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  
  // État pour le formulaire de création d'organisation
  const [newOrg, setNewOrg] = useState({
    name: "",
    plan: "Free" as Plan,
    subscriptionType: "monthly" as SubscriptionType,
    status: "active" as const,
    usersCount: 0,
  })

  // État pour le formulaire de modification d'organisation
  const [editedOrg, setEditedOrg] = useState<Organization | null>(null)

  // État pour créer un utilisateur avec l'organisation
  const [createUserWithOrg, setCreateUserWithOrg] = useState(false)
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "active" as const,
  })

  // Charger les organisations au montage du composant
  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const orgs = await getAllOrganizations()
        setOrganizations(orgs)
      } catch (error) {
        console.error("Erreur lors du chargement des organisations:", error)
        toast.error("Erreur lors du chargement des organisations")
      } finally {
        setIsLoading(false)
      }
    }
    loadOrganizations()
  }, [])

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || org.status === filterStatus
    const matchesPlan = filterPlan === "all" || org.plan === filterPlan
    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleCreateOrganization = async () => {
    // Validation organisation
    if (!newOrg.name) {
      toast.error("Veuillez remplir le nom de l'organisation")
      return
    }

    // Vérifier si le nom existe déjà
    if (organizations.some((org) => org.name.toLowerCase() === newOrg.name.toLowerCase())) {
      toast.error("Une organisation avec ce nom existe déjà")
      return
    }

    // Validation utilisateur si création demandée
    if (createUserWithOrg) {
      if (!newUser.firstName || !newUser.lastName || !newUser.email) {
        toast.error("Veuillez remplir tous les champs de l'utilisateur")
        return
      }
    }

    try {
      // Calculer le nombre d'utilisateurs (inclure l'utilisateur créé si demandé)
      const finalUsersCount = createUserWithOrg ? newOrg.usersCount + 1 : newOrg.usersCount

      // Créer l'organisation via l'API
      const createdOrg = await createOrganization({
        name: newOrg.name,
        usersCount: finalUsersCount,
        status: newOrg.status,
        plan: newOrg.plan,
        subscriptionType: newOrg.plan === "Pro" ? newOrg.subscriptionType : undefined,
      })

      // Ajouter l'organisation à la liste
      setOrganizations([...organizations, createdOrg])
      
      // Si un utilisateur doit être créé
      if (createUserWithOrg) {
        // TODO: Créer l'utilisateur via l'API
        // await createUser({ ...newUser, company: newOrg.name, plan: newOrg.plan })
        
        // Pour l'instant, on stocke dans localStorage (sera remplacé par l'API)
        const createdUser: User = {
          id: `user-${Date.now()}`,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          company: newOrg.name,
          plan: newOrg.plan,
          status: newUser.status,
          mrr: 0,
          createdAt: new Date().toISOString().split("T")[0],
        }
        
        const storedUsers = localStorage.getItem("newUsers") || "[]"
        const users = JSON.parse(storedUsers)
        users.push({ ...createdUser, organizationId: createdOrg.id })
        localStorage.setItem("newUsers", JSON.stringify(users))
        
        toast.success(`Organisation ${createdOrg.name} et utilisateur ${getFullName(createdUser)} créés avec succès`)
      } else {
        toast.success(`Organisation ${createdOrg.name} créée avec succès`)
      }
      
      // Réinitialiser les formulaires
      setNewOrg({
        name: "",
        plan: "Free",
        subscriptionType: "monthly",
        status: "active",
        usersCount: 0,
      })
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        status: "active",
      })
      setCreateUserWithOrg(false)
      
      // Fermer le dialog
      setShowNewOrgDialog(false)
    } catch (error) {
      console.error("Erreur lors de la création de l'organisation:", error)
      toast.error("Erreur lors de la création de l'organisation")
    }
  }

  const handleEditOrganization = (org: Organization) => {
    setSelectedOrg(org)
    setEditedOrg({ ...org })
    setShowEditOrgDialog(true)
  }

  const handleSaveOrganization = async () => {
    if (!editedOrg) return

    // Validation
    if (!editedOrg.name) {
      toast.error("Veuillez remplir le nom de l'organisation")
      return
    }

    // Vérifier si le nom existe déjà pour une autre organisation
    const nameExists = organizations.some(
      (org) => org.id !== editedOrg.id && org.name.toLowerCase() === editedOrg.name.toLowerCase()
    )
    if (nameExists) {
      toast.error("Une organisation avec ce nom existe déjà")
      return
    }

    try {
      // Mettre à jour l'organisation via l'API
      const updatedOrg = await updateOrganization(editedOrg.id, {
        name: editedOrg.name,
        plan: editedOrg.plan,
        subscriptionType: editedOrg.subscriptionType,
        usersCount: editedOrg.usersCount,
        status: editedOrg.status,
      })

      // Mettre à jour l'organisation dans la liste
      setOrganizations(organizations.map((org) => (org.id === updatedOrg.id ? updatedOrg : org)))

      // Fermer le dialog
      setShowEditOrgDialog(false)
      setEditedOrg(null)
      setSelectedOrg(null)

      toast.success(`Organisation ${updatedOrg.name} modifiée avec succès`)
    } catch (error) {
      console.error("Erreur lors de la modification de l'organisation:", error)
      toast.error("Erreur lors de la modification de l'organisation")
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Organisations</h1>
            <p className="text-muted-foreground">
              Gérez les organisations de votre plateforme
            </p>
          </div>
          <Button 
            className="btn-gradient"
            onClick={() => setShowNewOrgDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle organisation
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une organisation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>

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

              <Badge variant="outline" className="px-3 py-1">
                {filteredOrganizations.length} résultat{filteredOrganizations.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tableau */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des organisations</CardTitle>
            <CardDescription>
              Toutes les organisations enregistrées sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Chargement des organisations...
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Utilisateurs</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>MRR</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <Link 
                            href={`/organizations/${org.id}`}
                            className="font-medium hover:underline"
                          >
                            {org.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">ID: {org.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{org.usersCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge style={getPlanBadgeStyle(org.plan)}>
                        {formatPlan(org.plan, org.subscriptionType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{org.mrr}€</span>
                        <span className="text-sm text-muted-foreground">/mois</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {org.status === "active" ? (
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
                      ) : (
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
                    </TableCell>
                    <TableCell>
                      {new Date(org.createdAt).toLocaleDateString("fr-FR")}
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
                          <DropdownMenuItem onClick={() => handleEditOrganization(org)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/organizations/${org.id}`} className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Voir les détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => toast.error("Fonctionnalité à venir")}
                          >
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

      {/* Dialog Nouvelle Organisation */}
      <Dialog open={showNewOrgDialog} onOpenChange={setShowNewOrgDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nouvelle organisation
            </DialogTitle>
            <DialogDescription>
              Créer une nouvelle organisation sur la plateforme
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="org-name">Nom de l'organisation *</Label>
              <Input
                id="org-name"
                placeholder="TechCorp"
                value={newOrg.name}
                onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="org-plan">Plan</Label>
              <Select
                value={newOrg.plan}
                onValueChange={(value) => {
                  setNewOrg({ 
                    ...newOrg, 
                    plan: value as Plan,
                    // Réinitialiser le subscriptionType si on passe à Free
                    subscriptionType: value === "Free" ? "monthly" : newOrg.subscriptionType
                  })
                }}
              >
                <SelectTrigger id="org-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newOrg.plan === "Pro" && (
              <div>
                <Label htmlFor="org-subscription">Type d'abonnement</Label>
                <Select
                  value={newOrg.subscriptionType}
                  onValueChange={(value) => setNewOrg({ ...newOrg, subscriptionType: value as SubscriptionType })}
                >
                  <SelectTrigger id="org-subscription">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuel (29€/utilisateur/mois)</SelectItem>
                    <SelectItem value="yearly">Annuel (23€/utilisateur/mois)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="org-users">Nombre d'utilisateurs</Label>
              <Input
                id="org-users"
                type="number"
                min="0"
                placeholder="0"
                value={newOrg.usersCount}
                onChange={(e) => setNewOrg({ ...newOrg, usersCount: parseInt(e.target.value) || 0 })}
              />
              {newOrg.plan === "Pro" && newOrg.usersCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  MRR estimé : {calculateMRR(newOrg.plan, newOrg.usersCount, newOrg.subscriptionType)}€/mois
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="org-status">Statut</Label>
              <Select
                value={newOrg.status}
                onValueChange={(value) =>
                  setNewOrg({
                    ...newOrg,
                    status: value as "active" | "inactive",
                  })
                }
              >
                <SelectTrigger id="org-status" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Séparateur */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Label htmlFor="create-user">Créer un utilisateur pour cette organisation</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajouter un premier utilisateur rattaché à cette organisation
                  </p>
                </div>
                <Switch
                  id="create-user"
                  checked={createUserWithOrg}
                  onCheckedChange={setCreateUserWithOrg}
                />
              </div>

              {createUserWithOrg && (
                <div className="space-y-4 mt-4 p-4 bg-muted rounded-lg">
                  <div>
                    <Label htmlFor="user-firstName">Prénom de l'utilisateur *</Label>
                    <Input
                      id="user-firstName"
                      placeholder="Jean"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="user-lastName">Nom de l'utilisateur *</Label>
                    <Input
                      id="user-lastName"
                      placeholder="Dupont"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="user-email">Email de l'utilisateur *</Label>
                    <Input
                      id="user-email"
                      type="email"
                      placeholder="jean.dupont@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="user-status">Statut</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value) =>
                        setNewUser({
                          ...newUser,
                          status: value as "active" | "inactive" | "pending",
                        })
                      }
                    >
                      <SelectTrigger id="user-status" className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    L'utilisateur sera automatiquement rattaché à l'organisation "{newOrg.name || "..."}" avec le plan "{newOrg.plan}".
                    Le nombre d'utilisateurs de l'organisation sera mis à jour automatiquement.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowNewOrgDialog(false)
                setNewOrg({
                  name: "",
                  plan: "Free",
                  subscriptionType: "monthly",
                  status: "active",
                  usersCount: 0,
                })
                setNewUser({
                  firstName: "",
                  lastName: "",
                  email: "",
                  status: "active",
                })
                setCreateUserWithOrg(false)
              }}
            >
              Annuler
            </Button>
            <Button className="btn-gradient" onClick={handleCreateOrganization}>
              Créer l'organisation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Modification Organisation */}
      <Dialog open={showEditOrgDialog} onOpenChange={setShowEditOrgDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Modifier l'organisation
            </DialogTitle>
            <DialogDescription>
              Modifier les informations de l'organisation {selectedOrg?.name}
            </DialogDescription>
          </DialogHeader>

          {editedOrg && (
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="edit-org-name">Nom de l'organisation *</Label>
                <Input
                  id="edit-org-name"
                  placeholder="TechCorp"
                  value={editedOrg.name}
                  onChange={(e) => setEditedOrg({ ...editedOrg, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-org-plan">Plan</Label>
                <Select
                  value={editedOrg.plan}
                  onValueChange={(value) => {
                    setEditedOrg({
                      ...editedOrg,
                      plan: value as Plan,
                      subscriptionType: value === "Free" ? undefined : editedOrg.subscriptionType || "monthly",
                    })
                  }}
                >
                  <SelectTrigger id="edit-org-plan">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editedOrg.plan === "Pro" && (
                <div>
                  <Label htmlFor="edit-org-subscription">Type d'abonnement</Label>
                  <Select
                    value={editedOrg.subscriptionType || "monthly"}
                    onValueChange={(value) =>
                      setEditedOrg({ ...editedOrg, subscriptionType: value as SubscriptionType })
                    }
                  >
                    <SelectTrigger id="edit-org-subscription">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel (29€/utilisateur/mois)</SelectItem>
                      <SelectItem value="yearly">Annuel (23€/utilisateur/mois)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="edit-org-users">Nombre d'utilisateurs</Label>
                <Input
                  id="edit-org-users"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={editedOrg.usersCount}
                  onChange={(e) =>
                    setEditedOrg({ ...editedOrg, usersCount: parseInt(e.target.value) || 0 })
                  }
                />
                {editedOrg.plan === "Pro" && editedOrg.usersCount > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    MRR estimé :{" "}
                    {calculateMRR(
                      editedOrg.plan,
                      editedOrg.usersCount,
                      editedOrg.subscriptionType
                    )}
                    €/mois
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="edit-org-status">Statut</Label>
                <Select
                  value={editedOrg.status}
                  onValueChange={(value) =>
                    setEditedOrg({
                      ...editedOrg,
                      status: value as "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger id="edit-org-status" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditOrgDialog(false)
                setEditedOrg(null)
                setSelectedOrg(null)
              }}
            >
              Annuler
            </Button>
            <Button className="btn-gradient" onClick={handleSaveOrganization}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
