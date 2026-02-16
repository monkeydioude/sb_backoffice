/**
 * Source de données centralisée pour les utilisateurs
 * Cette fonction récupère tous les utilisateurs depuis les organisations
 */

import { User, getFullName } from "@/types"

// Données des organisations
const ORGANIZATIONS = [
  {
    id: "1",
    name: "TechCorp",
    plan: "Pro" as const,
  },
  {
    id: "2",
    name: "BusinessCo",
    plan: "Free" as const,
  },
]

// Type pour les utilisateurs avec métadonnées enrichies (pour la page de détail d'organisation)
export interface EnrichedUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  status: "active" | "inactive" | "pending"
  lastLogin: string
  createdAt: string
  loginCount: number
  totalSessionTime: number
}

// Fonction utilitaire pour séparer un nom complet en prénom et nom
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

// Tous les utilisateurs par organisation avec métadonnées enrichies
const ALL_USERS_BY_ORG: Record<string, EnrichedUser[]> = {
  "1": [
    {
      id: "1",
      firstName: "Sophie",
      lastName: "Martin",
      email: "sophie.martin@techcorp.com",
      role: "Admin",
      status: "active",
      lastLogin: "2024-02-07T14:32:00",
      createdAt: "2024-01-15",
      loginCount: 45,
      totalSessionTime: 1250,
    },
    {
      id: "2",
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-07T09:15:00",
      createdAt: "2024-01-16",
      loginCount: 38,
      totalSessionTime: 980,
    },
    {
      id: "4",
      firstName: "Pierre",
      lastName: "Lefebvre",
      email: "pierre.lefebvre@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-07T11:20:00",
      createdAt: "2024-01-17",
      loginCount: 32,
      totalSessionTime: 850,
    },
    {
      id: "5",
      firstName: "Claire",
      lastName: "Rousseau",
      email: "claire.rousseau@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-06T15:45:00",
      createdAt: "2024-01-18",
      loginCount: 28,
      totalSessionTime: 720,
    },
    {
      id: "6",
      firstName: "Thomas",
      lastName: "Bernard",
      email: "thomas.bernard@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-07T08:30:00",
      createdAt: "2024-01-19",
      loginCount: 35,
      totalSessionTime: 920,
    },
    {
      id: "7",
      firstName: "Emma",
      lastName: "Dubois",
      email: "emma.dubois@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-07T13:10:00",
      createdAt: "2024-01-20",
      loginCount: 29,
      totalSessionTime: 680,
    },
    {
      id: "8",
      firstName: "Lucas",
      lastName: "Moreau",
      email: "lucas.moreau@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-06T16:00:00",
      createdAt: "2024-01-21",
      loginCount: 26,
      totalSessionTime: 650,
    },
    {
      id: "9",
      firstName: "Léa",
      lastName: "Petit",
      email: "lea.petit@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-07T10:15:00",
      createdAt: "2024-01-22",
      loginCount: 31,
      totalSessionTime: 780,
    },
    {
      id: "10",
      firstName: "Hugo",
      lastName: "Laurent",
      email: "hugo.laurent@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-05T17:30:00",
      createdAt: "2024-01-23",
      loginCount: 22,
      totalSessionTime: 560,
    },
    {
      id: "11",
      firstName: "Camille",
      lastName: "Girard",
      email: "camille.girard@techcorp.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-07T12:00:00",
      createdAt: "2024-01-24",
      loginCount: 27,
      totalSessionTime: 690,
    },
  ],
  "2": [
    {
      id: "3",
      firstName: "Marie",
      lastName: "Durand",
      email: "marie.durand@businessco.com",
      role: "Admin",
      status: "active",
      lastLogin: "2024-02-06T16:20:00",
      createdAt: "2024-03-10",
      loginCount: 12,
      totalSessionTime: 320,
    },
    {
      id: "12",
      firstName: "Antoine",
      lastName: "Martin",
      email: "antoine.martin@businessco.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-07T09:00:00",
      createdAt: "2024-03-11",
      loginCount: 8,
      totalSessionTime: 180,
    },
    {
      id: "13",
      firstName: "Julie",
      lastName: "Blanc",
      email: "julie.blanc@businessco.com",
      role: "User",
      status: "active",
      lastLogin: "2024-02-05T14:30:00",
      createdAt: "2024-03-12",
      loginCount: 6,
      totalSessionTime: 145,
    },
  ],
}

/**
 * Récupère tous les utilisateurs de toutes les organisations
 */
export function getAllUsers(): User[] {
  const users: User[] = []
  
  ORGANIZATIONS.forEach((org) => {
    const orgUsers = ALL_USERS_BY_ORG[org.id] || []
    orgUsers.forEach((user) => {
      users.push({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: org.name,
        plan: org.plan,
        status: user.status,
        mrr: 0, // Le MRR est au niveau de l'organisation
        createdAt: user.createdAt,
      })
    })
  })
  
  return users
}

/**
 * Récupère les utilisateurs d'une organisation spécifique (format User simple)
 */
export function getUsersByOrganization(orgId: string): User[] {
  const org = ORGANIZATIONS.find((o) => o.id === orgId)
  if (!org) return []
  
  const orgUsers = ALL_USERS_BY_ORG[orgId] || []
  return orgUsers.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    company: org.name,
    plan: org.plan,
    status: user.status,
    mrr: 0,
    createdAt: user.createdAt,
  }))
}

/**
 * Récupère les utilisateurs enrichis d'une organisation spécifique (avec métadonnées)
 */
export function getEnrichedUsersByOrganization(orgId: string): EnrichedUser[] {
  return ALL_USERS_BY_ORG[orgId] || []
}
