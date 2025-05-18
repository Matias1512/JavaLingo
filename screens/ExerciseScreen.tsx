import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useGame } from "../context/GameContext"
import { useExercises } from "../context/ExerciseContext"
import { useAuth } from "../context/AuthContext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../config/firebaseConfig"

const ExerciseScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { levelId } = route.params as { levelId: number }
  const { lives, decreaseLives, completeLevel } = useGame()
  const { exercises, setExercises } = useExercises()
  const { user } = useAuth()
  const [exercise, setExercise] = useState(exercises.find((ex) => ex.id === levelId))

  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    if (lives === 0) {
      navigation.navigate("GameOver" as never)
    }
  }, [lives, navigation])

  const { updateExercise } = useExercises();

  const handleOptionSelect = async (optionIndex: number) => {
    setSelectedOption(optionIndex)

    const correct = optionIndex === exercise?.correctAnswer
    setIsCorrect(correct)

    if (!correct) {
      decreaseLives()
    } else {
      completeLevel(levelId)

      // Mise à jour en Firestore et dans le context
      await updateExercise({ ...exercise, completed: true });

      setExercises(prev =>
        prev.map(ex =>
          ex.id === levelId ? { ...ex, completed: true } : ex
        )
      )
    }

    setShowFeedback(true)
  }

  const handleContinue = () => {
    setShowFeedback(false)
    setSelectedOption(null)

    if (isCorrect) {
      navigation.navigate("LevelMap" as never)
    }
  }

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text>Exercice non trouvé</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>

      <View style={styles.optionsContainer}>
        {exercise.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index &&
                (index === exercise.correctAnswer ? styles.correctOption : styles.incorrectOption),
            ]}
            onPress={() => handleOptionSelect(index)}
            disabled={selectedOption !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showFeedback} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.feedbackTitle, isCorrect ? styles.correctFeedback : styles.incorrectFeedback]}>
              {isCorrect ? "Bonne réponse!" : "Mauvaise réponse"}
            </Text>

            {!isCorrect && <Text style={styles.explanation}>{exercise.explanation}</Text>}

            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueButtonText}>Continuer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  correctOption: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  incorrectOption: {
    backgroundColor: "#FFEBEE",
    borderColor: "#F44336",
  },
  optionText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  correctFeedback: {
    color: "#4CAF50",
  },
  incorrectFeedback: {
    color: "#F44336",
  },
  explanation: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 8,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ExerciseScreen
