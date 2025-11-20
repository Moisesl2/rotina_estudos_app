import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { ClipboardList, Plus } from "lucide-react-native";
import MenuLateral from "./menuLateral";
import ModalAdicionarTarefa from "./modalAdicionarTarefa";

export default function TurmaScreen() {
  const { turmaId, turmaNome, userType } = useLocalSearchParams<{
    turmaId: string;
    turmaNome: string;
    userType: "Aluno" | "Professor";
  
  }>();

  const drawerAnim = useRef(new Animated.Value(-300)).current;  // começa fora da tela
  const [drawerOpen, setDrawerOpen] = useState(false);


  const [tarefas, setTarefas] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [nomeLocal, setNomeLocal] = useState("");
  const [tipoLocal, setTipoLocal] = useState("");

  //Abertura e fechamento da drawer
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDrawerOpen(false));
  };

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
      {/* BOTÃO PARA ABRIR O DRAWER (só aparece quando está fechado) */}
      {!drawerOpen && (
        <>

          {/* LINHA DOS BOTÕES */}
          <View style={styles.rowButtons}>

            <TouchableOpacity onPress={openDrawer} style={styles.btnDrawer}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>

            {userType === "Professor" && (
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={() => setModalVisible(true)}
              >
                <ClipboardList size={26} color="#fff" style={{ marginRight: 8 }} />
                <Plus size={26} color="#fff" />
              </TouchableOpacity>
            )}

          </View>

          {/* TÍTULO DAS TAREFAS */}
          <Text style={styles.sectionTitle}>Tarefas da Turma</Text>

          {/* LISTA DE TAREFAS */}
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

        </>
      )}
      {/* Drawer importado */}
      <MenuLateral
        open={drawerOpen}
        onClose={closeDrawer}
        drawerAnim={drawerAnim}
        turmaNome={turmaNome}
        turmaId={turmaId}
        nomeLocal={nomeLocal}
        tipoLocal={tipoLocal}
      />
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
  rowButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 12,
    marginTop: 40
  },
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

  // Estilo do botão do drawer
  btnDrawer: {
    backgroundColor: "#6A1B9A",
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
