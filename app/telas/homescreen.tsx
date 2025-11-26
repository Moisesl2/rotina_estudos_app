import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  tarefasCount: Record<string, number>;
  onPressTurma: (turma: Turma) => void;
  onCriarTurma?: (cardTitulo: CardTipo) => void;
}

const Card = ({ titulo, turmas, userType, tarefasCount, onPressTurma, onCriarTurma }: CardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{titulo}</Text>

      {turmas.map((turma) => (
        <TouchableOpacity
          key={turma.id}
          style={styles.turmaButton}
          onPress={() => onPressTurma(turma)}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <Text style={styles.turmaText}>{turma.nome}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {tarefasCount[turma.id] ?? 0}
              </Text>
            </View>

          </View>
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
  const [tarefasCount, setTarefasCount] = useState<Record<string, number>>({});


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
    // carregarTurmas();
    carregarNomeUsuario();
    carregarTipoUsuario();
  }, []);

  // Recarrega quando voltar para Home
  useFocusEffect(
    useCallback(() => {
      carregarTurmas(); // isso também chama carregarQuantidadeTarefas()
    }, [])
  );


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

      
      // 🔥 carregar quantidade de tarefas
      carregarQuantidadeTarefas(novasTurmas);
    } catch (error) {
      console.log("Erro ao carregar turmas:", error);
    }
  };

  //Carregar contagem de tarefas por turma
    const carregarQuantidadeTarefas = async (turmas: Record<CardTipo, Turma[]>) => {
    try {
      const counts: Record<string, number> = {};

      for (const categoria of Object.keys(turmas) as CardTipo[]) {
        for (const turma of turmas[categoria]) {
          const chave = `tarefas_${turma.id}`;
          const dados = await AsyncStorage.getItem(chave);
          const lista = dados ? JSON.parse(dados) : [];
          counts[turma.id] = lista.length;
        }
      }

      setTarefasCount(counts);
    } catch (error) {
      console.log("Erro ao carregar quantidade de tarefas:", error);
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
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >

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
          tarefasCount={tarefasCount}
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
    </ScrollView>
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
  turmaText: { color: "#fff", textAlign: "center", marginLeft: 10, fontWeight: "bold" },
  criarButton: {
    marginTop: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 8,
    alignItems: "center",
  },
  criarText: { color: "#DC2626", fontWeight: "bold" },

  badge: {
    backgroundColor: "#6A1B9A",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

});
