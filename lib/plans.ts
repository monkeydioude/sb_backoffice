/**
 * Utilitaires pour la gestion des plans
 * Simplifié : seulement Free et Pro
 */

import { Plan, SubscriptionType, PLAN_PRICES, calculateMRR } from "@/types"

/**
 * Obtient le prix par utilisateur selon le plan et le type d'abonnement
 */
export function getPricePerUser(plan: Plan, subscriptionType?: SubscriptionType): number {
  if (plan === "Free") return PLAN_PRICES.Free
  if (plan === "Pro") {
    return subscriptionType === "yearly" ? PLAN_PRICES.Pro.yearly : PLAN_PRICES.Pro.monthly
  }
  return 0
}

/**
 * Formate le prix pour l'affichage
 */
export function formatPrice(price: number): string {
  return `${price}€`
}

/**
 * Formate le plan avec le type d'abonnement pour l'affichage
 */
export function formatPlan(plan: Plan, subscriptionType?: SubscriptionType): string {
  if (plan === "Free") return "Free"
  if (plan === "Pro") {
    return subscriptionType === "yearly" ? "Pro (Annuel)" : "Pro (Mensuel)"
  }
  return plan
}

/**
 * Obtient la couleur du badge selon le plan
 */
export function getPlanBadgeStyle(plan: Plan) {
  if (plan === "Pro") {
    return {
      backgroundColor: "#3B82F6" + "20",
      color: "#3B82F6",
      border: "none",
    }
  }
  return {
    backgroundColor: "#E5E7EB",
    color: "#717182",
    border: "none",
  }
}

/**
 * Calcule le MRR total pour une organisation
 */
export { calculateMRR }
