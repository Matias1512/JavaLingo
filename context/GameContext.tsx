"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface GameContextType {
  lives: number
  completedLevels: number[]
  decreaseLives: () => void
  completeLevel: (levelId: number) => void
  resetGame: () => void
  isLevelUnlocked: (levelId: number) => boolean
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lives, setLives] = useState(5)
  const [completedLevels, setCompletedLevels] = useState<number[]>([])

  // Load saved state from AsyncStorage
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const savedLives = await AsyncStorage.getItem("lives")
        const savedCompletedLevels = await AsyncStorage.getItem("completedLevels")

        if (savedLives) {
          setLives(Number.parseInt(savedLives, 10))
        }

        if (savedCompletedLevels) {
          setCompletedLevels(JSON.parse(savedCompletedLevels))
        }
      } catch (error) {
        console.error("Error loading saved state:", error)
      }
    }

    loadSavedState()
  }, [])

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem("lives", lives.toString())
        await AsyncStorage.setItem("completedLevels", JSON.stringify(completedLevels))
      } catch (error) {
        console.error("Error saving state:", error)
      }
    }

    saveState()
  }, [lives, completedLevels])

  const decreaseLives = () => {
    setLives((prev) => Math.max(0, prev - 1))
  }

  const completeLevel = (levelId: number) => {
    if (!completedLevels.includes(levelId)) {
      setCompletedLevels((prev) => [...prev, levelId])
    }
  }

  const resetGame = () => {
    setLives(5)
    setCompletedLevels([])
  }

  const isLevelUnlocked = (levelId: number) => {
    // First level is always unlocked
    if (levelId === 1) return true

    // Check if previous level is completed
    return completedLevels.includes(levelId - 1)
  }

  return (
    <GameContext.Provider
      value={{
        lives,
        completedLevels,
        decreaseLives,
        completeLevel,
        resetGame,
        isLevelUnlocked,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
