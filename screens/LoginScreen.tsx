"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from "react-native"
import { login, signup } from "../context/AuthContext"

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError("L'email est requis")
      return false
    } else if (!emailRegex.test(email)) {
      setEmailError("Format d'email invalide")
      return false
    }
    setEmailError("")
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Le mot de passe est requis")
      return false
    } else if (isSignUp && password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
  
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
  
    setIsLoading(true);
    try {
      if (isSignUp) {
        await signup(email, password);
        Alert.alert("Succès", "Compte créé avec succès !");
        setIsSignUp(false);
      } else {
        await login(email, password);
        // ➡️ SUPPRIME navigation.navigate("LevelMap") ici
        // C'est AuthProvider qui va rediriger tout seul !
      }
    } catch (error: any) {
      const errorCode = error.code;

      if (isSignUp) {
        Alert.alert("Erreur", "Erreur lors de la création du compte. Veuillez réessayer.");
      } else {
        if (errorCode === "auth/invalid-credential" || errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
          Alert.alert("Erreur", "Email ou mot de passe incorrect.");
        } else {
          Alert.alert("Erreur", "Une erreur est survenue. Code : " + errorCode);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setEmailError("")
    setPasswordError("")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.logoContainer}>
            <Text style={styles.appTitle}>JavaLinguo</Text>
          </View>

          <Text style={styles.title}>{isSignUp ? "Créer un compte" : "Connexion"}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email :</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              value={email}
              onChangeText={setEmail}
              placeholder="exemple@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={() => validateEmail(email)}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe :</Text>
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Votre mot de passe"
              onBlur={() => validatePassword(password)}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{isSignUp ? "S'inscrire" : "Se connecter"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {isSignUp ? "Déjà un compte? Se connecter" : "Pas de compte? S'inscrire"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2196F3",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#F44336",
  },
  errorText: {
    color: "#F44336",
    fontSize: 14,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 24,
    alignItems: "center",
  },
  toggleText: {
    color: "#2196F3",
    fontSize: 16,
  },
})
