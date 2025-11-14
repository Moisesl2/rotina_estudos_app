import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { ClipboardList, Plus } from "lucide-react-native";
import ModalAdicionarTarefa from "./modalAdicionarTarefa";

export default function TurmaScreen() {
  const { turmaId, turmaNome, userType, userName } = useLocalSearchParams<{
    turmaId: string;
    turmaNome: string;
    userType: "Aluno" | "Professor";
    userName: string;
  }>();


  const [tarefas, setTarefas] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [nomeLocal, setNomeLocal] = useState("");
  const [tipoLocal, setTipoLocal] = useState("");

  useEffect(() => {
    carregarTarefas();
    carregarUsuario();
  }, []);

  // 🔹 CARREGA nome e tipo do usuário do AsyncStorage
  const carregarUsuario = async () => {
    try {
      const nome = await AsyncStorage.getItem("userName");
      const tipo = await AsyncStorage.getItem("userType");

      if (nome) setNomeLocal(nome);
      if (tipo) setTipoLocal(tipo);
    } catch (error) {
      console.log("Erro ao carregar dados do usuário:", error);
    }
  };

  const carregarTarefas = async () => {
    try {
      const chave = `tarefas_${turmaId}`;
      const armazenadas = await AsyncStorage.getItem(chave);

      if (armazenadas) setTarefas(JSON.parse(armazenadas));
    } catch (error) {
      console.log("Erro ao carregar tarefas:", error);
    }
  };

  const salvarTarefas = async (listaAtualizada: string[]) => {
    try {
      const chave = `tarefas_${turmaId}`;
      await AsyncStorage.setItem(chave, JSON.stringify(listaAtualizada));
    } catch (error) {
      console.log("Erro ao salvar tarefas:", error);
    }
  };

  const adicionarTarefa = (tarefa: string) => {
    const listaAtualizada = [...tarefas, tarefa];
    setTarefas(listaAtualizada);
    salvarTarefas(listaAtualizada);
    // Alert.alert("Tarefa adicionada!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turma: {turmaNome}</Text>
      <Text style={styles.infoText}>ID da Turma: {turmaId}</Text>
      <Text style={styles.infoText}>Usuário: {nomeLocal}</Text>
      <Text style={styles.infoText}>Tipo: {tipoLocal}</Text>


      {/* BOTÃO PARA ADICIONAR TAREFA */}
      {userType === "Professor" && (
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => setModalVisible(true)}
        >
          <ClipboardList size={26} color="#fff" style={{ marginRight: 8 }} />
          <Plus size={26} color="#fff" />
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Tarefas da Turma</Text>

      {tarefas.length === 0 ? (
        <Text style={styles.noTasks}>Nenhuma tarefa cadastrada.</Text>
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskText}>• {item}</Text>
            </View>
          )}
        />
      )}

      {/* MODAL */}
      <ModalAdicionarTarefa
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={adicionarTarefa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, marginTop: 40 },
  infoText: {
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },


  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    width: 80,
    marginTop: 10,
  },

  sectionTitle: { fontSize: 18, marginTop: 25, fontWeight: "bold" },
  noTasks: { marginTop: 10, fontStyle: "italic", color: "#666" },

  taskItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginTop: 10,
  },
  taskText: { fontSize: 16 },
});
