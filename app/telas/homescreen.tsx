import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  // const { userType: userTypeParam } =
  //   useLocalSearchParams<{ userType: "Aluno" | "Professor" }>();
  // const [userType] = useState<"Aluno" | "Professor">(userTypeParam || "Aluno");
  const [userType, setUserType] = useState<"Aluno" | "Professor">("Aluno"); 
  const [userName, setUserName] = useState<string>(""); // estado para armazenar o nome

  // ==============================
  // 1. Estado das turmas
  // ==============================
  const [turmasData, setTurmasData] = useState<Record<CardTipo, Turma[]>>({
    Sopro: [],
    Corda: [],
    Percussao: [],
  });

  const cards: CardTipo[] = ["Sopro", "Corda", "Percussao"];

  // ==============================
  // 2. Carregar turmas do AsyncStorage ao abrir
  // ==============================
  useEffect(() => {
    carregarTurmas();
    carregarNomeUsuario();
    carregarTipoUsuario();
  }, []);

  const carregarNomeUsuario = async () => {
    try {
      const nome = await AsyncStorage.getItem("userName");
      if (nome) setUserName(nome);
    } catch (error) {
      console.log("Erro ao carregar nome do usuário:", error);
    }
  };

  const carregarTipoUsuario = async () => {
  try {
    const tipo = await AsyncStorage.getItem("userType");
    if (tipo === "Aluno" || tipo === "Professor") {
      setUserType(tipo);
    }
  } catch (error) {
    console.log("Erro ao carregar tipo do usuário:", error);
  }
};


  const carregarTurmas = async () => {
    try {
      const novasTurmas: Record<CardTipo, Turma[]> = {
        Sopro: [],
        Corda: [],
        Percussao: [],
      };

      for (const card of cards) {
        const chave = `turmas_${card}`;
        const dados = await AsyncStorage.getItem(chave);

        if (dados) {
          novasTurmas[card] = JSON.parse(dados);
        }
      }

      setTurmasData(novasTurmas);
    } catch (error) {
      console.log("Erro ao carregar turmas:", error);
    }
  };

  // ==============================
  // 3. Salvar turmas localmente
  // ==============================
  const salvarTurmas = async (card: CardTipo, turmas: Turma[]) => {
    try {
      const chave = `turmas_${card}`;
      await AsyncStorage.setItem(chave, JSON.stringify(turmas));
    } catch (error) {
      console.log("Erro ao salvar turmas:", error);
    }
  };

  // ==============================
  // 4. Criar nova turma
  // ==============================
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCardTitulo, setModalCardTitulo] = useState<CardTipo | "">("");

  const handleCriarTurmaClick = (cardTitulo: CardTipo) => {
    setModalCardTitulo(cardTitulo);
    setModalVisible(true);
  };

  const handleConfirmarCriarTurma = (nomeTurma: string) => {
    if (!modalCardTitulo) return;

    const novaTurma: Turma = {
      id: Date.now().toString(),
      nome: nomeTurma,
    };

    const listaAtualizada = [
      ...turmasData[modalCardTitulo],
      novaTurma,
    ];

    // Atualiza o estado
    setTurmasData((prev) => ({
      ...prev,
      [modalCardTitulo]: listaAtualizada,
    }));

    // Salva no AsyncStorage
    salvarTurmas(modalCardTitulo, listaAtualizada);

    Alert.alert("Turma criada!", nomeTurma);
  };

  // ==============================
  // 5. Ação ao clicar em uma turma
  // ==============================
  const handlePressTurma = (turma: Turma) => {
    router.push({
      pathname: "/telas/turmas",
      params: { turmaId: turma.id, turmaNome: turma.nome, userType },
    });
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f5f5f5" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        Bem-vindo, {userName}
      </Text>

      {cards.map((card) => (
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  turmaButton: {
    paddingVertical: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    marginBottom: 8,
  },
  turmaText: { color: "#fff", textAlign: "center" },
  criarButton: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 8,
    alignItems: "center",
  },
  criarText: { color: "#DC2626", fontWeight: "bold" },
});
