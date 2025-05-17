"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default function NetworkErrorScreen() {
  const navigation = useNavigation()
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)

  const continueOffline = () => {
    navigation.navigate("OfflineLogin" as never)
  }

  const retryConnection = async () => {
    setIsCheckingConnection(true)

    // Simuler une vérification de connexion
    setTimeout(() => {
      setIsCheckingConnection(false)
      Alert.alert(
        "Toujours hors ligne",
        "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.",
      )
    }, 2000)
  }

  const exitApp = () => {
    // Pour React Native, on ne peut pas vraiment "fermer" l'application
    // Donc on peut simplement informer l'utilisateur
    Alert.alert("Information", "Vous pouvez fermer l'application et réessayer plus tard.")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={{ uri: "https://placeholder.svg?height=100&width=100" }} style={styles.logo} />

        <Text style={styles.title}>ERREUR DE CONNEXION</Text>

        <Text style={styles.message}>
          Impossible de se connecter au serveur CodeQuest. Veuillez vérifier votre connexion internet ou continuer en
          mode hors ligne.
        </Text>

        <TouchableOpacity style={styles.offlineButton} onPress={continueOffline}>
          <Text style={styles.offlineButtonText}>CONTINUER EN MODE HORS LIGNE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retryButton} onPress={retryConnection} disabled={isCheckingConnection}>
          {isCheckingConnection ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.retryButtonText}>RÉESSAYER</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={exitApp} style={styles.exitButton}>
          <Text style={styles.exitButtonText}>QUITTER</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  offlineButton: {
    backgroundColor: "#2196F3",
    width: "100%",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 15,
  },
  offlineButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#333",
    width: "100%",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 15,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  exitButton: {
    padding: 15,
  },
  exitButtonText: {
    color: "#aaa",
    fontSize: 16,
  },
})
