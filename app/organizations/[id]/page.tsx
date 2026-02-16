"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Building2,
  ArrowLeft,
  Users,
  Clock,
  Activity,
  TrendingUp,
  LogIn,
  LogOut,
  MapPin,
  Monitor,
  CheckCircle,
  XCircle,
  Euro,
  Calendar,
  BarChart3,
  Zap,
  CreditCard,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { Organization, LoginLog, UserActivity, EngagementStats, getFullName } from "@/types"
import { formatPlan, getPlanBadgeStyle } from "@/lib/plans"
import { getEnrichedUsersByOrganization, EnrichedUser } from "@/lib/users-data"
import { getOrganizationById } from "@/lib/api"
import { useEffect, useState } from "react"

// Utilisateurs de l'organisation (utilise la source de données centralisée)

// Fonction utilitaire pour séparer un nom complet
function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(" ")
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" }
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

// Logs de connexion
const getLoginLogs = (orgId: string): LoginLog[] => {
  const logsByOrg: Record<string, any[]> = {
    "1": [
      {
        id: "1",
        userId: "1",
        userName: "Sophie Martin",
        userEmail: "sophie.martin@techcorp.com",
        loginAt: "2024-02-07T14:32:00",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        location: "Paris, France",
        status: "success",
        logoutAt: "2024-02-07T17:45:00",
        sessionDuration: 193,
      },
      {
        id: "2",
        userId: "2",
        userName: "Jean Dupont",
        userEmail: "jean.dupont@techcorp.com",
        loginAt: "2024-02-07T09:15:00",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        location: "Lyon, France",
        status: "success",
        logoutAt: "2024-02-07T12:30:00",
        sessionDuration: 195,
      },
      {
        id: "3",
        userId: "1",
        userName: "Sophie Martin",
        userEmail: "sophie.martin@techcorp.com",
        loginAt: "2024-02-06T08:20:00",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        location: "Paris, France",
        status: "success",
        logoutAt: "2024-02-06T18:00:00",
        sessionDuration: 580,
      },
      {
        id: "5",
        userId: "4",
        userName: "Pierre Lefebvre",
        userEmail: "pierre.lefebvre@techcorp.com",
        loginAt: "2024-02-07T11:20:00",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        location: "Paris, France",
        status: "success",
        logoutAt: "2024-02-07T15:30:00",
        sessionDuration: 250,
      },
      {
        id: "6",
        userId: "5",
        userName: "Claire Rousseau",
        userEmail: "claire.rousseau@techcorp.com",
        loginAt: "2024-02-06T15:45:00",
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        location: "Lyon, France",
        status: "success",
        logoutAt: "2024-02-06T18:20:00",
        sessionDuration: 155,
      },
      {
        id: "7",
        userId: "6",
        userName: "Thomas Bernard",
        userEmail: "thomas.bernard@techcorp.com",
        loginAt: "2024-02-07T08:30:00",
        ipAddress: "192.168.1.104",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        location: "Paris, France",
        status: "success",
        logoutAt: "2024-02-07T12:00:00",
        sessionDuration: 210,
      },
      {
        id: "8",
        userId: "7",
        userName: "Emma Dubois",
        userEmail: "emma.dubois@techcorp.com",
        loginAt: "2024-02-07T13:10:00",
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)",
        location: "Paris, France",
        status: "success",
        logoutAt: "2024-02-07T16:45:00",
        sessionDuration: 215,
      },
    ],
    "2": [
      {
        id: "4",
        userId: "3",
        userName: "Marie Durand",
        userEmail: "marie.durand@businessco.com",
        loginAt: "2024-02-06T16:20:00",
        ipAddress: "10.0.0.50",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)",
        location: "Marseille, France",
        status: "success",
        logoutAt: "2024-02-06T17:45:00",
        sessionDuration: 85,
      },
      {
        id: "9",
        userId: "12",
        userName: "Antoine Martin",
        userEmail: "antoine.martin@businessco.com",
        loginAt: "2024-02-07T09:00:00",
        ipAddress: "10.0.0.51",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        location: "Marseille, France",
        status: "success",
        logoutAt: "2024-02-07T11:30:00",
        sessionDuration: 150,
      },
      {
        id: "10",
        userId: "13",
        userName: "Julie Blanc",
        userEmail: "julie.blanc@businessco.com",
        loginAt: "2024-02-05T14:30:00",
        ipAddress: "10.0.0.52",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        location: "Marseille, France",
        status: "success",
        logoutAt: "2024-02-05T16:15:00",
        sessionDuration: 105,
      },
    ],
  }
  // Convertir les logs pour utiliser firstName et lastName
  const logs = logsByOrg[orgId] || []
  return logs.map((log) => {
    const { firstName, lastName } = splitName(log.userName)
    return {
      ...log,
      userFirstName: firstName,
      userLastName: lastName,
    } as LoginLog
  })
}

// Métriques d'activité
const getUserActivities = (orgId: string): UserActivity[] => {
  const activitiesByOrg: Record<string, any[]> = {
    "1": [
      {
        userId: "1",
        userName: "Sophie Martin",
        userEmail: "sophie.martin@techcorp.com",
        lastLogin: "2024-02-07T14:32:00",
        loginCount: 45,
        totalSessionTime: 1250,
        averageSessionTime: 28,
        featuresUsed: ["Dashboard", "Expenses", "Reports", "Settings"],
        actionsCount: 342,
        projectsCreated: 8,
        expensesAdded: 156,
      },
      {
        userId: "2",
        userName: "Jean Dupont",
        userEmail: "jean.dupont@techcorp.com",
        lastLogin: "2024-02-07T09:15:00",
        loginCount: 38,
        totalSessionTime: 980,
        averageSessionTime: 26,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 198,
        projectsCreated: 3,
        expensesAdded: 89,
      },
      {
        userId: "4",
        userName: "Pierre Lefebvre",
        userEmail: "pierre.lefebvre@techcorp.com",
        lastLogin: "2024-02-07T11:20:00",
        loginCount: 32,
        totalSessionTime: 850,
        averageSessionTime: 27,
        featuresUsed: ["Dashboard", "Expenses", "Reports"],
        actionsCount: 156,
        projectsCreated: 5,
        expensesAdded: 78,
      },
      {
        userId: "5",
        userName: "Claire Rousseau",
        userEmail: "claire.rousseau@techcorp.com",
        lastLogin: "2024-02-06T15:45:00",
        loginCount: 28,
        totalSessionTime: 720,
        averageSessionTime: 26,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 134,
        projectsCreated: 2,
        expensesAdded: 67,
      },
      {
        userId: "6",
        userName: "Thomas Bernard",
        userEmail: "thomas.bernard@techcorp.com",
        lastLogin: "2024-02-07T08:30:00",
        loginCount: 35,
        totalSessionTime: 920,
        averageSessionTime: 26,
        featuresUsed: ["Dashboard", "Expenses", "Settings"],
        actionsCount: 178,
        projectsCreated: 4,
        expensesAdded: 92,
      },
      {
        userId: "7",
        userName: "Emma Dubois",
        userEmail: "emma.dubois@techcorp.com",
        lastLogin: "2024-02-07T13:10:00",
        loginCount: 29,
        totalSessionTime: 680,
        averageSessionTime: 23,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 112,
        projectsCreated: 2,
        expensesAdded: 54,
      },
      {
        userId: "8",
        userName: "Lucas Moreau",
        userEmail: "lucas.moreau@techcorp.com",
        lastLogin: "2024-02-06T16:00:00",
        loginCount: 26,
        totalSessionTime: 650,
        averageSessionTime: 25,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 98,
        projectsCreated: 1,
        expensesAdded: 45,
      },
      {
        userId: "9",
        userName: "Léa Petit",
        userEmail: "lea.petit@techcorp.com",
        lastLogin: "2024-02-07T10:15:00",
        loginCount: 31,
        totalSessionTime: 780,
        averageSessionTime: 25,
        featuresUsed: ["Dashboard", "Expenses", "Reports"],
        actionsCount: 145,
        projectsCreated: 3,
        expensesAdded: 71,
      },
      {
        userId: "10",
        userName: "Hugo Laurent",
        userEmail: "hugo.laurent@techcorp.com",
        lastLogin: "2024-02-05T17:30:00",
        loginCount: 22,
        totalSessionTime: 560,
        averageSessionTime: 25,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 87,
        projectsCreated: 1,
        expensesAdded: 38,
      },
      {
        userId: "11",
        userName: "Camille Girard",
        userEmail: "camille.girard@techcorp.com",
        lastLogin: "2024-02-07T12:00:00",
        loginCount: 27,
        totalSessionTime: 690,
        averageSessionTime: 26,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 123,
        projectsCreated: 2,
        expensesAdded: 61,
      },
    ],
    "2": [
      {
        userId: "3",
        userName: "Marie Durand",
        userEmail: "marie.durand@businessco.com",
        lastLogin: "2024-02-06T16:20:00",
        loginCount: 12,
        totalSessionTime: 320,
        averageSessionTime: 27,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 45,
        projectsCreated: 1,
        expensesAdded: 23,
      },
      {
        userId: "12",
        userName: "Antoine Martin",
        userEmail: "antoine.martin@businessco.com",
        lastLogin: "2024-02-07T09:00:00",
        loginCount: 8,
        totalSessionTime: 180,
        averageSessionTime: 23,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 28,
        projectsCreated: 0,
        expensesAdded: 15,
      },
      {
        userId: "13",
        userName: "Julie Blanc",
        userEmail: "julie.blanc@businessco.com",
        lastLogin: "2024-02-05T14:30:00",
        loginCount: 6,
        totalSessionTime: 145,
        averageSessionTime: 24,
        featuresUsed: ["Dashboard", "Expenses"],
        actionsCount: 19,
        projectsCreated: 0,
        expensesAdded: 12,
      },
    ],
  }
  // Convertir les activités pour utiliser firstName et lastName
  const activities = activitiesByOrg[orgId] || []
  return activities.map((activity) => {
    const { firstName, lastName } = splitName(activity.userName)
    return {
      ...activity,
      userFirstName: firstName,
      userLastName: lastName,
    } as UserActivity
  })
}

// Statistiques d'engagement
const getEngagementStats = (orgId: string): EngagementStats => {
  const statsByOrg: Record<string, EngagementStats> = {
    "1": {
      dailyActiveUsers: 8,
      weeklyActiveUsers: 10,
      monthlyActiveUsers: 10,
      averageSessionsPerUser: 4.2,
      averageSessionDuration: 27,
      mostActiveHour: 14,
      mostActiveDay: "Lundi",
      topFeatures: [
        { feature: "Dashboard", usageCount: 245 },
        { feature: "Expenses", usageCount: 189 },
        { feature: "Reports", usageCount: 67 },
      ],
    },
    "2": {
      dailyActiveUsers: 2,
      weeklyActiveUsers: 3,
      monthlyActiveUsers: 3,
      averageSessionsPerUser: 2.2,
      averageSessionDuration: 25,
      mostActiveHour: 16,
      mostActiveDay: "Mercredi",
      topFeatures: [
        { feature: "Dashboard", usageCount: 48 },
        { feature: "Expenses", usageCount: 38 },
      ],
    },
  }
  return statsByOrg[orgId] || {
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    monthlyActiveUsers: 0,
    averageSessionsPerUser: 0,
    averageSessionDuration: 0,
    mostActiveHour: 0,
    mostActiveDay: "Lundi",
    topFeatures: [],
  }
}

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orgId = params.id as string
  const [logFilter, setLogFilter] = useState<string>("all")
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const users = getEnrichedUsersByOrganization(orgId)
  const loginLogs = getLoginLogs(orgId)
  const userActivities = getUserActivities(orgId)
  const engagementStats = getEngagementStats(orgId)

  // Charger l'organisation au montage
  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const org = await getOrganizationById(orgId)
        setOrganization(org)
      } catch (error) {
        console.error("Erreur lors du chargement de l'organisation:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadOrganization()
  }, [orgId])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-8 text-muted-foreground">
            Chargement de l'organisation...
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!organization) {
    return (
      <MainLayout>
        <div className="container mx-auto px-6 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Organisation non trouvée</p>
              <Button onClick={() => router.push("/organizations")} className="mt-4">
                Retour aux organisations
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  const filteredLogs = logFilter === "all" 
    ? loginLogs 
    : loginLogs.filter(log => log.status === logFilter)

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}min`
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/organizations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{organization.name}</h1>
                <p className="text-muted-foreground">ID: {organization.id}</p>
              </div>
            </div>
          </div>
          <Badge style={getPlanBadgeStyle(organization.plan)}>
            {formatPlan(organization.plan, organization.subscriptionType)}
          </Badge>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                  <p className="text-2xl font-bold">{organization.usersCount}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">MRR</p>
                  <p className="text-2xl font-bold">{organization.mrr}€</p>
                </div>
                <Euro className="w-8 h-8 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">DAU</p>
                  <p className="text-2xl font-bold">{engagementStats.dailyActiveUsers}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions moy.</p>
                  <p className="text-2xl font-bold">{engagementStats.averageSessionDuration}min</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="billing">Facturation</TabsTrigger>
            <TabsTrigger value="logs">Logs de connexion</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          {/* Onglet Utilisateurs */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Utilisateurs de l'organisation</CardTitle>
                <CardDescription>
                  Liste des {users.length} utilisateur{users.length > 1 ? "s" : ""} de {organization.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Connexions</TableHead>
                      <TableHead>Temps total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
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
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.status === "active" ? (
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
                          {new Date(user.lastLogin).toLocaleString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{user.loginCount}</span>
                        </TableCell>
                        <TableCell>
                          {formatDuration(user.totalSessionTime)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Facturation */}
          <TabsContent value="billing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Abonnement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Plan actuel</span>
                    <Badge style={getPlanBadgeStyle(organization.plan)}>
                      {formatPlan(organization.plan, organization.subscriptionType)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">MRR</span>
                    <span className="font-semibold text-lg">
                      {organization.mrr.toLocaleString("fr-FR")}€/mois
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">ARR</span>
                    <span className="font-semibold text-lg">
                      {(organization.mrr * 12).toLocaleString("fr-FR")}€/an
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Nombre d'utilisateurs</span>
                    <span className="font-semibold">{organization.usersCount}</span>
                  </div>
                  {organization.plan === "Pro" && organization.subscriptionType && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Prix par utilisateur</span>
                      <span className="font-semibold">
                        {organization.subscriptionType === "yearly" ? "23" : "29"}€/mois
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Paiements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Prochain paiement</span>
                    <span className="font-semibold">
                      {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dernier paiement</span>
                    <span>
                      {new Date().toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Statut</span>
                    {organization.status === "active" ? (
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
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Voir l'historique de facturation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Détails de facturation</CardTitle>
                <CardDescription>
                  Informations détaillées sur l'abonnement et la facturation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Type d'abonnement</p>
                      <p className="font-semibold">
                        {organization.plan === "Free" 
                          ? "Gratuit" 
                          : organization.subscriptionType === "yearly" 
                            ? "Annuel" 
                            : "Mensuel"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date de création</p>
                      <p className="font-semibold">
                        {new Date(organization.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total facturé (annuel)</p>
                      <p className="font-semibold">
                        {(organization.mrr * 12).toLocaleString("fr-FR")}€
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Logs de connexion */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Logs de connexion</CardTitle>
                    <CardDescription>
                      Historique des connexions et déconnexions
                    </CardDescription>
                  </div>
                  <Select value={logFilter} onValueChange={setLogFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les connexions</SelectItem>
                      <SelectItem value="success">Connexions réussies</SelectItem>
                      <SelectItem value="failed">Connexions échouées</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{getFullName({ firstName: log.userFirstName, lastName: log.userLastName })}</p>
                            <p className="text-sm text-muted-foreground">{log.userEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <LogIn className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm">
                                {new Date(log.loginAt).toLocaleDateString("fr-FR")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.loginAt).toLocaleTimeString("fr-FR")}
                              </p>
                            </div>
                          </div>
                          {log.logoutAt && (
                            <div className="flex items-center gap-2 mt-1">
                              <LogOut className="w-4 h-4 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                Déconnexion: {new Date(log.logoutAt).toLocaleTimeString("fr-FR")}
                              </p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Monitor className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-mono">{log.ipAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.location ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{log.location}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.sessionDuration ? (
                            <span className="text-sm">{formatDuration(log.sessionDuration)}</span>
                          ) : (
                            <span className="text-sm text-muted-foreground">En cours</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {log.status === "success" ? (
                            <Badge
                              className="gap-1"
                              style={{
                                backgroundColor: "#10B981" + "20",
                                color: "#10B981",
                                border: "none",
                              }}
                            >
                              <CheckCircle className="w-3 h-3" />
                              Réussi
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
                              Échoué
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Activité */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activité des utilisateurs</CardTitle>
                <CardDescription>
                  Métriques détaillées d'utilisation par utilisateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userActivities.map((activity) => (
                    <Card key={activity.userId}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {activity.userFirstName?.[0] || ""}{activity.userLastName?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{getFullName({ firstName: activity.userFirstName, lastName: activity.userLastName })}</p>
                              <p className="text-sm text-muted-foreground">{activity.userEmail}</p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {activity.loginCount} connexions
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Temps total</p>
                            <p className="font-semibold">{formatDuration(activity.totalSessionTime)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Temps moyen</p>
                            <p className="font-semibold">{activity.averageSessionTime} min</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Actions</p>
                            <p className="font-semibold">{activity.actionsCount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Dernière connexion</p>
                            <p className="font-semibold text-sm">
                              {new Date(activity.lastLogin).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-2">Fonctionnalités utilisées</p>
                          <div className="flex flex-wrap gap-2">
                            {activity.featuresUsed.map((feature, idx) => (
                              <Badge key={idx} variant="outline">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Projets créés</p>
                            <p className="font-semibold">{activity.projectsCreated}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Dépenses ajoutées</p>
                            <p className="font-semibold">{activity.expensesAdded}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Actions totales</p>
                            <p className="font-semibold">{activity.actionsCount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Statistiques */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Utilisateurs actifs quotidiens</span>
                    <span className="font-semibold">{engagementStats.dailyActiveUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Utilisateurs actifs hebdomadaires</span>
                    <span className="font-semibold">{engagementStats.weeklyActiveUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Utilisateurs actifs mensuels</span>
                    <span className="font-semibold">{engagementStats.monthlyActiveUsers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sessions moy. par utilisateur</span>
                    <span className="font-semibold">{engagementStats.averageSessionsPerUser.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Durée moyenne de session</span>
                    <span className="font-semibold">{engagementStats.averageSessionDuration} min</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Heure la plus active</span>
                    <span className="font-semibold">{engagementStats.mostActiveHour}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Jour le plus actif</span>
                    <span className="font-semibold">{engagementStats.mostActiveDay}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités les plus utilisées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {engagementStats.topFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{feature.feature}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(feature.usageCount / engagementStats.topFeatures[0]?.usageCount) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">
                          {feature.usageCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
