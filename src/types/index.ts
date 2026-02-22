// Types pour le back-office Spendbaker

export type Plan = "Free" | "Pro"
export type SubscriptionType = "monthly" | "yearly"

// Prix par utilisateur par mois
export const PLAN_PRICES = {
  Free: 0,
  Pro: {
    monthly: 29, // 29€/utilisateur/mois si mensuel
    yearly: 23,  // 23€/utilisateur/mois si annuel
  },
} as const

// Fonction utilitaire pour calculer le MRR d'une organisation
export function calculateMRR(plan: Plan, usersCount: number, subscriptionType?: SubscriptionType): number {
  if (plan === "Free") return 0
  if (plan === "Pro") {
    const pricePerUser = subscriptionType === "yearly" ? PLAN_PRICES.Pro.yearly : PLAN_PRICES.Pro.monthly
    return pricePerUser * usersCount
  }
  return 0
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  company: string
  plan: Plan
  status: "active" | "inactive" | "pending"
  mrr: number
  createdAt: string
  avatar?: string
  phone?: string
  address?: string
  lastLogin?: string
  totalExpenses?: number
  activeProjects?: number
}

// Fonction utilitaire pour obtenir le nom complet
export function getFullName(user: { firstName: string; lastName: string }): string {
  return `${user.firstName} ${user.lastName}`.trim()
}

export interface Organization {
  id: string
  name: string
  usersCount: number
  status: "active" | "inactive"
  createdAt: string
  plan: Plan
  subscriptionType?: SubscriptionType // "monthly" ou "yearly" pour le plan Pro
  mrr: number
}

export interface DashboardStats {
  totalOrganizations: number
  totalUsers: number
  activeUsers: number
  growthRate: number
}

export interface RevenueStats {
  mrr: number
  arr: number
}

export type DateFilter = "today" | "week" | "month" | "quarter" | "year" | "all" | "custom"

export interface CustomDateRange {
  startDate: Date
  endDate: Date
}

// Logs de connexion
export interface LoginLog {
  id: string
  userId: string
  userFirstName: string
  userLastName: string
  userEmail: string
  loginAt: string
  ipAddress: string
  userAgent: string
  location?: string
  status: "success" | "failed"
  logoutAt?: string
  sessionDuration?: number // en minutes
}

// Métriques d'usage utilisateur
export interface UserActivity {
  userId: string
  userFirstName: string
  userLastName: string
  userEmail: string
  lastLogin: string
  loginCount: number // Nombre de connexions sur la période
  totalSessionTime: number // Temps total de session en minutes
  averageSessionTime: number // Temps moyen de session en minutes
  featuresUsed: string[] // Liste des features utilisées
  actionsCount: number // Nombre d'actions effectuées
  projectsCreated: number
  expensesAdded: number
}

// Statistiques d'engagement
export interface EngagementStats {
  dailyActiveUsers: number
  weeklyActiveUsers: number
  monthlyActiveUsers: number
  averageSessionsPerUser: number
  averageSessionDuration: number
  mostActiveHour: number // Heure de la journée (0-23)
  mostActiveDay: string // Jour de la semaine
  topFeatures: Array<{ feature: string; usageCount: number }>
}
