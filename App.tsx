import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// Define the allowed icon names for FontAwesome
type FontAwesomeIconName = "star" | "book" | "heart"; // Add "heart" for the icon

const pathExercice = [
  { id: 1, idLesson: 1, title: "Titre1", icon: "star" as FontAwesomeIconName, description: "COMMENCER", locked: false },
  { id: 2, idLesson: 1, title: "Titre2", icon: "book" as FontAwesomeIconName, description: "Lire un article", locked: true },
  { id: 3, idLesson: 1, title: "Titre3", icon: "book" as FontAwesomeIconName, description: "Apprendre une leçon", locked: true },
  { id: 4, idLesson: 1, title: "Titre4", icon: "star" as FontAwesomeIconName, description: "Atteindre un objectif", locked: true },
  { id: 5, idLesson: 2, title: "Titre5", icon: "book" as FontAwesomeIconName, description: "S'entraîner avec des exercices", locked: true },
  { id: 6, idLesson: 2, title: "Titre6", icon: "book" as FontAwesomeIconName, description: "Étudier un concept", locked: true },
  { id: 7, idLesson: 2, title: "Titre7", icon: "star" as FontAwesomeIconName, description: "Gagner des points", locked: true },
  { id: 8, idLesson: 1, title: "Titre8", icon: "star" as FontAwesomeIconName, description: "Débloquer un nouveau niveau", locked: true }
];

const pathLessons = [
  { id: 1, title: "Lesson1", description: "JAVA", color: "#4299E1" },
  { id: 2, title: "Lesson2", description: "PYTHON", color: "#ED8936" }
];

export default function Lessons() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [heartCount, setHeartCount] = useState<number>(5); // Variable pour le nombre de cœurs

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.heartContainer}>
          <FontAwesome name="heart" size={20} color="white" />
          <Text style={styles.heartText}>{heartCount}</Text>
        </View>
        <Text style={styles.appName}>JavaLingo</Text>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Lessons */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pathLessons.map((lesson) => {
          const exercises = pathExercice.filter(ex => ex.idLesson === lesson.id);

          return (
            <View key={lesson.id} style={styles.lessonContainer}>
              <View style={[styles.lessonBanner, { backgroundColor: lesson.color }]}>  
                <Text style={styles.lessonTitle}>{lesson.title.toUpperCase()}</Text>
                <Text style={styles.lessonDescription}>{lesson.description}</Text>
              </View>

              {exercises.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.iconContainer, { backgroundColor: item.locked ? "#D1D5DB" : "#4299E1" }]}
                  onPress={() => setHoveredItem(hoveredItem === item.id ? null : item.id)}
                >
                  <FontAwesome name={item.icon} size={24} color={item.locked ? "#6B7280" : "#FFFFFF"} />
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6"
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4299E1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 40,
    zIndex: 1
  },
  heartContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  heartText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5
  },
  appName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1
  },
  loginButton: {
    padding: 8,
    backgroundColor: "#ED8936",
    borderRadius: 5
  },
  loginText: {
    color: "white",
    fontWeight: "bold"
  },
  scrollContainer: {
    paddingTop: 100, // Ajoute un espace pour éviter que les leçons chevauchent la barre
    paddingBottom: 20,
    alignItems: "center"
  },
  lessonContainer: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center"
  },
  lessonBanner: {
    width: "100%",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  lessonDescription: {
    fontSize: 16,
    color: "white"
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  }
});