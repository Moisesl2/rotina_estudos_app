import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TurmaScreen() {
  const { turmaId, turmaNome, userType } = useLocalSearchParams<{ turmaId: string; turmaNome: string; userType: "Aluno" | "Professor" }>();

  // Aqui você pode implementar funcionalidades específicas da turma

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes da Turma</Text>
      <Text style={styles.info}>ID: {turmaId}</Text>
      <Text style={styles.info}>Nome: {turmaNome}</Text>
      <Text style={styles.info}>Tipo de usuário: {userType}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 8,
  },
});
