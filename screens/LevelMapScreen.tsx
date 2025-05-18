import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGame } from "../context/GameContext";
import { useExercises } from "../context/ExerciseContext";

const LevelMapScreen = () => {
  const navigation = useNavigation();
  const { completedLevels, isLevelUnlocked } = useGame();
  const { exercises, loadingExercises } = useExercises();

  console.log("🧠 Exercices visibles dans LevelMap : ", exercises);

  const handleLevelPress = (levelId: number) => {
    if (isLevelUnlocked(levelId)) {
      navigation.navigate("Exercise" as never, { levelId } as never);
    }
  };
 
  const getLevelStatus = (levelId: number) => {
    if (completedLevels.includes(levelId)) {
      return "completed";
    }
    if (isLevelUnlocked(levelId)) {
      return "unlocked";
    }
    return "locked";
  };

  if (loadingExercises) {
    return (
      <View style={styles.container}>
        <Text>Chargement des exercices...</Text>
      </View>
    );
  }

  if (exercises.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Aucun exercice disponible.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Niveaux de Programmation</Text>
      <View style={styles.levelGrid}>
        {[...exercises]
          .sort((a, b) => a.id - b.id)
          .map((exercise) => {
          const status = getLevelStatus(exercise.id);
          return (
            <TouchableOpacity
              key={exercise.id}
              style={[
                styles.levelButton,
                status === "completed" && styles.completedLevel,
                status === "unlocked" && styles.unlockedLevel,
                status === "locked" && styles.lockedLevel,
              ]}
              onPress={() => handleLevelPress(exercise.id)}
              disabled={status === "locked"}
            >
              <Text style={[styles.levelText, status === "locked" && styles.lockedLevelText]}>{exercise.id}</Text>
              {status === "completed" && (
                <View style={styles.completedBadge}>
                  <Text style={styles.completedBadgeText}>✓</Text>
                </View>
              )}
              {status === "locked" && (
                <View style={styles.lockedBadge}>
                  <Text style={styles.lockedBadgeText}>🔒</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  levelGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
  },
  levelButton: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  completedLevel: {
    backgroundColor: "#4CAF50",
  },
  unlockedLevel: {
    backgroundColor: "#2196F3",
  },
  lockedLevel: {
    backgroundColor: "#9E9E9E",
  },
  levelText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  lockedLevelText: {
    opacity: 0.5,
  },
  completedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FFD700",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  completedBadgeText: {
    color: "#000",
    fontWeight: "bold",
  },
  lockedBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  lockedBadgeText: {
    fontSize: 12,
  },
});

export default LevelMapScreen;
