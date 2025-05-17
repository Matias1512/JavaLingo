"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from "@react-native-community/netinfo"

interface OfflineContextType {
  isOfflineMode: boolean
  username: string
  setOfflineMode: (value: boolean) => void
  setUsername: (name: string) => void
  checkNetworkStatus: () => Promise<boolean>
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined)

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [username, setUsername] = useState("")

  // Charger l'état du mode hors ligne et le nom d'utilisateur au démarrage
  useEffect(() => {
    const loadOfflineState = async () => {
      try {
        const offlineMode = await AsyncStorage.getItem("isOfflineMode")
        const savedUsername = await AsyncStorage.getItem("lastUsername")

        if (offlineMode === "true") {
          setIsOfflineMode(true)
        }

        if (savedUsername) {
          setUsername(savedUsername)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'état hors ligne:", error)
      }
    }

    loadOfflineState()
  }, [])

  // Sauvegarder l'état du mode hors ligne quand il change
  useEffect(() => {
    const saveOfflineState = async () => {
      try {
        await AsyncStorage.setItem("isOfflineMode", isOfflineMode ? "true" : "false")
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'état hors ligne:", error)
      }
    }

    saveOfflineState()
  }, [isOfflineMode])

  // Sauvegarder le nom d'utilisateur quand il change
  useEffect(() => {
    const saveUsername = async () => {
      if (username) {
        try {
          await AsyncStorage.setItem("lastUsername", username)
        } catch (error) {
          console.error("Erreur lors de la sauvegarde du nom d'utilisateur:", error)
        }
      }
    }

    saveUsername()
  }, [username])

  const setOfflineMode = (value: boolean) => {
    setIsOfflineMode(value)
  }

  const checkNetworkStatus = async (): Promise<boolean> => {
    try {
      const state = await NetInfo.fetch()
      return state.isConnected || false
    } catch (error) {
      console.error("Erreur lors de la vérification de la connexion:", error)
      return false
    }
  }

  return (
    <OfflineContext.Provider
      value={{
        isOfflineMode,
        username,
        setOfflineMode,
        setUsername,
        checkNetworkStatus,
      }}
    >
      {children}
    </OfflineContext.Provider>
  )
}

export const useOffline = () => {
  const context = useContext(OfflineContext)
  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider")
  }
  return context
}
