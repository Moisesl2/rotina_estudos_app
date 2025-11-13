import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CriarTurmaModal from "./criarTurmaModal";

type CardTipo = "Sopro" | "Corda" | "Percussao";

interface Turma {
  id: string;
  nome: string;
}

interface CardProps {
  titulo: CardTipo;
  turmas: Turma[];
  userType: "Aluno" | "Professor";
  onPressTurma: (turma: Turma) => void;
  onCriarTurma?: (cardTitulo: CardTipo) => void;
}

// Componente Card permanece igual, mas com nome alterado para onPressTurma em vez de onEntrarTurma
const Card = ({ titulo, turmas, userType, onPressTurma, onCriarTurma }: CardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titulo}</Text>
      {turmas.map((turma) => (
        <TouchableOpacity
          key={turma.id}
          style={styles.turmaButton}
          onPress={() => onPressTurma(turma)}
        >
          <Text style={styles.turmaText}>{turma.nome}</Text>
        </TouchableOpacity>
      ))}
      {userType === "Professor" && onCriarTurma && (
        <TouchableOpacity
          style={styles.criarButton}
          onPress={() => onCriarTurma(titulo)}
        >
          <Text style={styles.criarText}>+ Criar nova turma</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default function HomeScreen() {
    const router = useRouter();
  const { userType: userTypeParam } = useLocalSearchParams<{ userType: "Aluno" | "Professor" }>();
  const [userType] = useState<"Aluno" | "Professor">(userTypeParam || "Aluno");

  const [turmasData, setTurmasData] = useState<Record<CardTipo, Turma[]>>({
    Sopro: [{ id: "1", nome: "Turma Sopro 1" }, { id: "2", nome: "Turma Sopro 2" }],
    Corda: [{ id: "3", nome: "Turma Corda 1" }],
    Percussao: [{ id: "4", nome: "Turma Percussão 1" }],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalCardTitulo, setModalCardTitulo] = useState<CardTipo | "">("");

  const handlePressTurma = (turma: Turma) => {
    router.push({
      pathname: "/telas/turmas",
      params: { turmaId: turma.id, turmaNome: turma.nome, userType }
    });
  };

  const handleCriarTurmaClick = (cardTitulo: CardTipo) => {
    setModalCardTitulo(cardTitulo);
    setModalVisible(true);
  };

  const handleConfirmarCriarTurma = (nomeTurma: string) => {
    if (!modalCardTitulo) return;
    const novaTurma = { id: Date.now().toString(), nome: nomeTurma };
    setTurmasData(prev => ({
      ...prev,
      [modalCardTitulo]: [...prev[modalCardTitulo], novaTurma],
    }));
    Alert.alert(`Turma criada: ${nomeTurma}`);
  };

  const cards: CardTipo[] = ["Sopro", "Corda", "Percussao"];

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
        Bem-vindo, {userType}
      </Text>

      {cards.map(card => (
        <Card
          key={card}
          titulo={card}
          turmas={turmasData[card]}
          userType={userType}
          onPressTurma={handlePressTurma}
          onCriarTurma={userType === "Professor" ? handleCriarTurmaClick : undefined}
        />
      ))}

      <CriarTurmaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmarCriarTurma}
        cardTitulo={modalCardTitulo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  turmaButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    marginBottom: 8,
  },
  turmaText: {
    color: "#fff",
  },
  criarButton: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 8,
    alignItems: "center",
  },
  criarText: {
    color: "#DC2626",
    fontWeight: "bold",
  },
});
