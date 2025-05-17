"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
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
  const [username, setUsername] = useState("")
  const [isCheckingConnection, setIsCheckingConnection] = useState(false)
  const [lastUsername, setLastUsername] = useState("")

  // Récupérer le dernier nom d'utilisateur utilisé
  useEffect(() => {
    const getLastUser = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("lastUsername")
        if (savedUsername) {
          setLastUsername(savedUsername)
          setUsername(savedUsername)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du nom d'utilisateur:", error)
      }
    }

    getLastUser()
  }, [])

  const continueOffline = async () => {
    if (username.trim()) {
      try {
        // Sauvegarder le nom d'utilisateur pour une utilisation future
        await AsyncStorage.setItem("lastUsername", username)
        await AsyncStorage.setItem("isOfflineMode", "true")

        // Naviguer vers la carte des niveaux
        navigation.navigate("LevelMap" as never)
      } catch (error) {
        Alert.alert("Erreur", "Impossible de sauvegarder les informations. Veuillez réessayer.")
      }
    } else {
      Alert.alert("Nom d'utilisateur requis", "Veuillez entrer un nom d'utilisateur pour continuer en mode hors ligne.")
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
    // Pour React Native, on ne peut pas vraiment "fermer" l'application
    // Donc on peut simplement revenir en arrière si possible
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      // Sinon, on peut juste informer l'utilisateur
      Alert.alert("Information", "Vous pouvez fermer l'application et réessayer plus tard.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View style={styles.content}>
        <Image source={{ uri: "https://placeholder.svg?height=80&width=80" }} style={styles.logo} />

        <Text style={styles.title}>ERREUR DE CONNEXION</Text>

        <Text style={styles.message}>
          Impossible de se connecter au serveur CodeQuest. Veuillez vérifier votre connexion internet puis Réessayer ou
          Continuer en mode hors ligne.
        </Text>

        <Text style={styles.loginLabel}>SE CONNECTER</Text>

        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <TouchableOpacity style={styles.offlineButton} onPress={continueOffline}>
          <Text style={styles.offlineButtonText}>CONTINUER EN MODE HORS LIGNE</Text>
        </TouchableOpacity>

        <View style={styles.bottomOptions}>
          <TouchableOpacity onPress={retryConnection} style={styles.linkButton}>
            {isCheckingConnection ? (
              <ActivityIndicator size="small" color="#2196F3" />
            ) : (
              <Text style={styles.linkText}>Réessayer la connexion</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={connectLater} style={styles.linkButton}>
            <Text style={styles.linkText}>Se connecter plus tard</Text>
          </TouchableOpacity>
        </View>
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
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  loginLabel: {
    fontSize: 16,
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#333",
    width: "100%",
    padding: 15,
    borderRadius: 4,
    color: "#fff",
    marginBottom: 20,
  },
  offlineButton: {
    backgroundColor: "#2196F3",
    width: "100%",
    padding: 15,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 30,
  },
  offlineButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  bottomOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: "#2196F3",
    fontSize: 14,
  },
})
