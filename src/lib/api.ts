/**
 * 🚀 API Service - Spendbaker Back Office
 * 
 * Ce fichier centralise tous les appels API.
 * Pour connecter le backend, remplacez simplement les fonctions ci-dessous
 * par vos vrais appels API.
 * 
 * Exemple :
 * - Remplacer `getAllOrganizations()` par `fetch('/api/organizations').then(r => r.json())`
 */

import { SAMPLE_ORGANIZATIONS } from "@/lib/organizations-data"
import { getAllUsers as getBaseUsers } from "@/lib/users-data"
import { Organization, User } from "@/types"

// ==========================================
// 🔧 CONFIGURATION API
// ==========================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

// Mode développement : utiliser localStorage + données de base
const USE_DEV_MODE = true // Mettre à false quand le backend est connecté

/**
 * Fonction utilitaire pour faire des appels API
 * À adapter selon votre backend (fetch, axios, etc.)
 */
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        // Ajoutez ici vos headers d'authentification
        // "Authorization": `Bearer ${token}`,
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error)
    throw error
  }
}

// ==========================================
// 📦 ORGANISATIONS
// ==========================================

/**
 * Récupère toutes les organisations
 * TODO: Remplacer par votre endpoint API
 */
export async function getAllOrganizations(): Promise<Organization[]> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<Organization[]>("/organizations")
  
  // Mode dev : combine données de base + localStorage
  if (USE_DEV_MODE) {
    const baseOrgs = [...SAMPLE_ORGANIZATIONS]
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("newOrganizations")
      if (stored) {
        try {
          const storedOrgs: Organization[] = JSON.parse(stored)
          storedOrgs.forEach((storedOrg) => {
            if (!baseOrgs.some((org) => org.id === storedOrg.id)) {
              baseOrgs.push(storedOrg)
            }
          })
        } catch {
          // Ignorer les erreurs de parsing
        }
      }
    }
    return baseOrgs
  }
  
  // Mode production : appel API
  return apiCall<Organization[]>("/organizations")
}

/**
 * Récupère une organisation par son ID
 * TODO: Remplacer par votre endpoint API
 */
export async function getOrganizationById(id: string): Promise<Organization | null> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<Organization>(`/organizations/${id}`)
  
  if (USE_DEV_MODE) {
    const orgs = await getAllOrganizations()
    return orgs.find((org) => org.id === id) || null
  }
  
  return apiCall<Organization>(`/organizations/${id}`)
}

/**
 * Crée une nouvelle organisation
 * TODO: Remplacer par votre endpoint API
 */
export async function createOrganization(
  organization: Omit<Organization, "id" | "createdAt" | "mrr">
): Promise<Organization> {
  if (!USE_DEV_MODE) {
    // 🔄 Mode production : appel API
    return apiCall<Organization>("/organizations", {
      method: "POST",
      body: JSON.stringify(organization),
    })
  }
  
  // Mode dev : sauvegarde dans localStorage
  const newOrg: Organization = {
    ...organization,
    id: `org-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    mrr: 0, // Sera calculé côté backend
  }
  
  const stored = localStorage.getItem("newOrganizations") || "[]"
  const orgs = JSON.parse(stored)
  orgs.push(newOrg)
  localStorage.setItem("newOrganizations", JSON.stringify(orgs))
  
  return newOrg
}

/**
 * Met à jour une organisation
 * TODO: Remplacer par votre endpoint API
 */
export async function updateOrganization(
  id: string,
  organization: Partial<Organization>
): Promise<Organization> {
  if (!USE_DEV_MODE) {
    // 🔄 Mode production : appel API
    return apiCall<Organization>(`/organizations/${id}`, {
      method: "PUT",
      body: JSON.stringify(organization),
    })
  }
  
  // Mode dev : mise à jour dans localStorage
  const stored = localStorage.getItem("newOrganizations") || "[]"
  const orgs: Organization[] = JSON.parse(stored)
  const index = orgs.findIndex((org) => org.id === id)
  
  if (index === -1) {
    throw new Error(`Organization ${id} not found`)
  }
  
  const updated = { ...orgs[index], ...organization }
  orgs[index] = updated
  localStorage.setItem("newOrganizations", JSON.stringify(orgs))
  
  return updated
}

/**
 * Supprime une organisation
 * TODO: Remplacer par votre endpoint API
 */
export async function deleteOrganization(id: string): Promise<void> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<void>(`/organizations/${id}`, {
  //   method: "DELETE",
  // })
  
  const stored = localStorage.getItem("newOrganizations") || "[]"
  const orgs: Organization[] = JSON.parse(stored)
  const filtered = orgs.filter((org) => org.id !== id)
  localStorage.setItem("newOrganizations", JSON.stringify(filtered))
}

// ==========================================
// 👥 UTILISATEURS
// ==========================================

/**
 * Récupère tous les utilisateurs
 * TODO: Remplacer par votre endpoint API
 */
export async function getAllUsers(): Promise<User[]> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<User[]>("/users")
  
  // Mode dev : combine données de base + localStorage
  if (USE_DEV_MODE) {
    const baseUsers = getBaseUsers()
    const allUsers = [...baseUsers]
    
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("newUsers")
      if (stored) {
        try {
          const storedUsers = JSON.parse(stored)
          storedUsers.forEach((u: any) => {
            const { organizationId, name, ...user } = u
            // Convertir les anciens utilisateurs avec "name" vers firstName/lastName
            if (name && !user.firstName) {
              const parts = name.trim().split(" ")
              user.firstName = parts[0] || ""
              user.lastName = parts.slice(1).join(" ") || ""
            }
            // Éviter les doublons
            if (!allUsers.some((u) => u.id === user.id)) {
              allUsers.push(user as User)
            }
          })
        } catch {
          // Ignorer les erreurs de parsing
        }
      }
    }
    return allUsers
  }
  
  // Mode production : appel API
  return apiCall<User[]>("/users")
}

/**
 * Récupère un utilisateur par son ID
 * TODO: Remplacer par votre endpoint API
 */
export async function getUserById(id: string): Promise<User | null> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<User>(`/users/${id}`)
  
  const users = await getAllUsers()
  return users.find((user) => user.id === id) || null
}

/**
 * Récupère les utilisateurs d'une organisation
 * TODO: Remplacer par votre endpoint API
 */
export async function getUsersByOrganization(orgId: string): Promise<User[]> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<User[]>(`/organizations/${orgId}/users`)
  
  const users = await getAllUsers()
  return users.filter((user) => user.company === orgId)
}

/**
 * Crée un nouvel utilisateur
 * TODO: Remplacer par votre endpoint API
 */
export async function createUser(
  user: Omit<User, "id" | "createdAt" | "mrr">
): Promise<User> {
  if (!USE_DEV_MODE) {
    // 🔄 Mode production : appel API
    return apiCall<User>("/users", {
      method: "POST",
      body: JSON.stringify(user),
    })
  }
  
  // Mode dev : sauvegarde dans localStorage
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    mrr: 0,
  }
  
  const stored = localStorage.getItem("newUsers") || "[]"
  const users = JSON.parse(stored)
  users.push(newUser)
  localStorage.setItem("newUsers", JSON.stringify(users))
  
  return newUser
}

/**
 * Met à jour un utilisateur
 * TODO: Remplacer par votre endpoint API
 */
export async function updateUser(
  id: string,
  user: Partial<User>
): Promise<User> {
  if (!USE_DEV_MODE) {
    // 🔄 Mode production : appel API
    return apiCall<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    })
  }
  
  // Mode dev : mise à jour dans localStorage
  const stored = localStorage.getItem("newUsers") || "[]"
  const users: any[] = JSON.parse(stored)
  const index = users.findIndex((u) => u.id === id)
  
  if (index === -1) {
    throw new Error(`User ${id} not found`)
  }
  
  const updated = { ...users[index], ...user }
  users[index] = updated
  localStorage.setItem("newUsers", JSON.stringify(users))
  
  return updated as User
}

/**
 * Supprime un utilisateur
 * TODO: Remplacer par votre endpoint API
 */
export async function deleteUser(id: string): Promise<void> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<void>(`/users/${id}`, {
  //   method: "DELETE",
  // })
  
  const stored = localStorage.getItem("newUsers") || "[]"
  const users: any[] = JSON.parse(stored)
  const filtered = users.filter((u) => u.id !== id)
  localStorage.setItem("newUsers", JSON.stringify(filtered))
}

// ==========================================
// 🔐 AUTHENTIFICATION (exemple)
// ==========================================

/**
 * Exemple de fonction d'authentification
 * TODO: Implémenter selon votre système d'auth
 */
export async function login(email: string, password: string): Promise<{ token: string }> {
  // 🔄 À REMPLACER PAR :
  // return apiCall<{ token: string }>("/auth/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  // })
  
  throw new Error("Not implemented - Connect to your auth API")
}
