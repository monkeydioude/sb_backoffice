/**
 * Source de données centralisée pour les organisations
 */

import { Organization } from "@/types"
import { calculateMRR } from "@/types"

// Données des organisations
export const SAMPLE_ORGANIZATIONS: Organization[] = [
  {
    id: "1",
    name: "TechCorp",
    usersCount: 10,
    status: "active",
    createdAt: "2024-01-15",
    plan: "Pro",
    subscriptionType: "yearly", // 23€/utilisateur/mois
    mrr: calculateMRR("Pro", 10, "yearly"), // 10 * 23 = 230€
  },
  {
    id: "2",
    name: "BusinessCo",
    usersCount: 3,
    status: "active",
    createdAt: "2024-03-10",
    plan: "Free",
    mrr: 0,
  },
]

/**
 * Récupère toutes les organisations
 */
export function getAllOrganizations(): Organization[] {
  return SAMPLE_ORGANIZATIONS
}

/**
 * Récupère une organisation par son ID
 */
export function getOrganizationById(id: string): Organization | undefined {
  return SAMPLE_ORGANIZATIONS.find((org) => org.id === id)
}
