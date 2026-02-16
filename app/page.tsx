"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Users, 
  Building2, 
  TrendingUp,
  Activity,
  Euro,
  DollarSign
} from "lucide-react"
import { DateFilter, RevenueStats, CustomDateRange } from "@/types"
import { DatePicker } from "@/components/ui/date-picker"
import { getAllOrganizations } from "@/lib/api"
import { getAllUsers } from "@/lib/api"
import { useEffect, useState } from "react"

const getStatsByPeriod = (
  allOrgs: any[],
  allUsers: any[],
  period: DateFilter,
  customRange?: CustomDateRange
) => {
  
  // Pour les statistiques générales, on affiche toujours toutes les organisations actives
  // Le filtre par période est utilisé uniquement pour calculer les nouveaux clients dans la période
  const activeOrgs = allOrgs.filter((org) => org.status === "active")
  const totalOrganizations = activeOrgs.length
  
  // Calculer le nombre de nouvelles organisations dans la période sélectionnée
  let newOrgsInPeriod = 0
  if (period !== "all") {
    const now = new Date()
    newOrgsInPeriod = activeOrgs.filter((org) => {
      const orgDate = new Date(org.createdAt)
      
      if (period === "today") {
        return orgDate.toDateString() === now.toDateString()
      }
      if (period === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orgDate >= weekAgo
      }
      if (period === "month") {
        return orgDate.getMonth() === now.getMonth() && orgDate.getFullYear() === now.getFullYear()
      }
      if (period === "quarter") {
        const quarter = Math.floor(now.getMonth() / 3)
        return Math.floor(orgDate.getMonth() / 3) === quarter && orgDate.getFullYear() === now.getFullYear()
      }
      if (period === "year") {
        return orgDate.getFullYear() === now.getFullYear()
      }
      if (period === "custom" && customRange) {
        return orgDate >= customRange.startDate && orgDate <= customRange.endDate
      }
      return false
    }).length
  } else {
    newOrgsInPeriod = totalOrganizations
  }
  
  // Calculer le taux de croissance (comparaison avec le mois précédent)
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const orgsLastMonth = activeOrgs.filter(
    (org) => new Date(org.createdAt) < lastMonth
  ).length
  const growthRate = orgsLastMonth > 0 
    ? ((newOrgsInPeriod / orgsLastMonth) * 100)
    : newOrgsInPeriod > 0 ? 100 : 0
  
  // Calculer le nombre total d'utilisateurs et d'utilisateurs actifs depuis les données centralisées
  const totalUsersFromData = allUsers.length
  const activeUsersFromData = allUsers.filter((u) => u.status === "active").length
  
  return {
    totalOrganizations, // Toujours le total de toutes les organisations actives
    totalUsers: totalUsersFromData, // Utiliser les données centralisées
    activeUsers: activeUsersFromData, // Utiliser les données centralisées
    growthRate: Math.round(growthRate * 10) / 10,
  }
}

const getRevenueStatsByPeriod = (
  allOrgs: any[],
  period: DateFilter,
  customRange?: CustomDateRange
): RevenueStats => {
  
  // Pour les chiffres d'affaires, on prend toutes les organisations actives
  // Le filtre par période pourrait être utilisé pour filtrer les nouveaux clients, mais pour le MRR total,
  // on veut afficher le MRR de toutes les organisations actives
  const activeOrgs = allOrgs.filter((org) => org.status === "active")
  
  // Calculer le MRR total de toutes les organisations actives
  const totalMRR = activeOrgs.reduce((sum, org) => sum + org.mrr, 0)
  
  // Calculer les métriques
  const arr = totalMRR * 12
  
  return {
    mrr: totalMRR,
    arr,
  }
}

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("month")
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange | undefined>(undefined)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgs, usrs] = await Promise.all([
          getAllOrganizations(),
          getAllUsers(),
        ])
        setOrganizations(orgs)
        setUsers(usrs)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const stats = getStatsByPeriod(organizations, users, dateFilter, customDateRange)
  const revenueStats = getRevenueStatsByPeriod(organizations, dateFilter, customDateRange)

  const getPeriodLabel = (period: DateFilter): string => {
    switch (period) {
      case "today": return "Aujourd'hui"
      case "week": return "7 derniers jours"
      case "month": return "Ce mois"
      case "quarter": return "Ce trimestre"
      case "year": return "Cette année"
      case "all": return "Tout"
      case "custom": 
        if (customDateRange) {
          return `${customDateRange.startDate.toLocaleDateString("fr-FR")} - ${customDateRange.endDate.toLocaleDateString("fr-FR")}`
        }
        return "Période personnalisée"
      default: return "Ce mois"
    }
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date && customDateRange) {
      setCustomDateRange({ ...customDateRange, startDate: date })
    } else if (date) {
      setCustomDateRange({ startDate: date, endDate: date })
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && customDateRange) {
      setCustomDateRange({ ...customDateRange, endDate: date })
    } else if (date && !customDateRange) {
      const today = new Date()
      setCustomDateRange({ startDate: today, endDate: date })
    }
  }

  const handleFilterChange = (value: string) => {
    const newFilter = value as DateFilter
    setDateFilter(newFilter)
    if (newFilter === "custom" && !customDateRange) {
      // Initialiser avec le mois en cours par défaut
      const today = new Date()
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
      setCustomDateRange({ startDate: firstDay, endDate: today })
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Header avec filtre */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre plateforme Spendbaker
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Période :</span>
              <Select value={dateFilter} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                  <SelectItem value="all">Tout</SelectItem>
                  <SelectItem value="custom">Dates personnalisées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {dateFilter === "custom" && customDateRange && (
              <DatePicker
                startDate={customDateRange.startDate}
                endDate={customDateRange.endDate}
                onStartDateChange={handleStartDateChange}
                onEndDateChange={handleEndDateChange}
              />
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Organisations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Organisations
                  </p>
                  <p className="text-3xl font-bold">{stats.totalOrganizations}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+{stats.growthRate}% ce mois</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Utilisateurs */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Utilisateurs
                  </p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+8% ce mois</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilisateurs Actifs */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Utilisateurs Actifs
                  </p>
                  <p className="text-3xl font-bold">{stats.activeUsers}</p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                    <span>
                      {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% du total
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Taux d'Activation */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Taux d'Activation
                  </p>
                  <p className="text-3xl font-bold">
                    {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+2% ce mois</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Chiffres d'affaires */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">Chiffres d'affaires</h2>
            <p className="text-sm text-muted-foreground">
              Données financières pour {getPeriodLabel(dateFilter).toLowerCase()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* MRR */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      MRR
                    </p>
                    <p className="text-3xl font-bold">{revenueStats.mrr.toLocaleString("fr-FR")}€</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <span>Revenu mensuel récurrent</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Euro className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ARR */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      ARR
                    </p>
                    <p className="text-3xl font-bold">{revenueStats.arr.toLocaleString("fr-FR")}€</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <span>MRR × 12</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
