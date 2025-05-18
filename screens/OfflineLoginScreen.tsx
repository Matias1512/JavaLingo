"use client"

import { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function OfflineLoginScreen() {
  const navigation = useNavigation()
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)

  const playAsGuest = async () => {
    try {
      // Sauvegarder le mode invité
      await AsyncStorage.setItem("isOfflineMode", "true")
      await AsyncStorage.setItem("isGuestMode", "true")
      await AsyncStorage.setItem("lastUsername", "Invité")

      // Naviguer vers la carte des niveaux
      navigation.navigate("LevelMap" as never)
    } catch (error) {
      Alert.alert("Erreur", "Impossible de sauvegarder les informations. Veuillez réessayer.")
    }
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

  const connectLater = () => {
    // Fermer l'application ou revenir à l'écran précédent
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      // Sinon, on peut juste informer l'utilisateur
      Alert.alert("Information", "Vous pouvez fermer l'application et réessayer plus tard.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.content}>
        <Image source={{ uri: "https://placeholder.svg?height=80&width=80" }} style={styles.logo} />

        <Text style={styles.title}>ERREUR DE CONNEXION</Text>

        <Text style={styles.message}>
          Impossible de se connecter au serveur CodeQuest. Veuillez vérifier votre connexion internet puis Réessayer ou
          Continuer en mode invité.
        </Text>

        <TouchableOpacity style={styles.guestButton} onPress={playAsGuest}>
          <Text style={styles.guestButtonText}>JOUER EN MODE INVITÉ</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.retryButton} onPress={retryConnection} disabled={isCheckingConnection}>
          {isCheckingConnection ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : (
            <Text style={styles.retryButtonText}>RÉESSAYER LA CONNEXION</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={connectLater} style={styles.laterButton}>
          <Text style={styles.laterButtonText}>SE CONNECTER PLUS TARD</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  guestButton: {
    backgroundColor: "#2196F3",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  guestButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    paddingHorizontal: 10,
    color: "#999999",
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#f5f5f5",
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  retryButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 16,
  },
  laterButton: {
    padding: 15,
  },
  laterButtonText: {
    color: "#666666",
    fontSize: 14,
  },
})
