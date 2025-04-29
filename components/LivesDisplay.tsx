import { View, Text, StyleSheet } from "react-native"
import { useGame } from "../context/GameContext"

const LivesDisplay = () => {
  const { lives } = useGame()

  return (
    <View style={styles.container}>
      <Text style={styles.livesText}>
        {"❤️ ".repeat(lives)}
        {"🖤 ".repeat(Math.max(0, 5 - lives))}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  livesText: {
    fontSize: 16,
  },
})

export default LivesDisplay
