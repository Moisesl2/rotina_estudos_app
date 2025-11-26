import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { CheckCircle, ClipboardList } from "lucide-react-native";


import MenuLateral from "./menuLateral";
import ModalAdicionarTarefa from "./modalAdicionarTarefa";
import ModalComentario from "./modalComentario";
import ModalVideo from "./modalVideo";
import Participantes from "./participantes";

interface Tarefa {
  texto: string;
  referenciaVideo?: string;
  conclusaoAluno?: string;
  concluida?: boolean;
  alunoNome?: string; // 🆕 nome do aluno que concluiu
  comentarioProfessor?: string; // ← ADICIONADO
  referenciaPdf?: string;     // ✅ ADICIONADO
}


export default function TurmaScreen() {
  const { turmaId, turmaNome, userType,  } = useLocalSearchParams<{
    turmaId: string;
    turmaNome: string;
    userType: "Aluno" | "Professor";
  }>();
  const [secao, setSecao] = useState<"tarefas" | "concluidas" | "participantes">("tarefas");


  const drawerAnim = useRef(new Animated.Value(-300)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [modalMode, setModalMode] = useState<"professor-add" | "aluno-confirm">(
    "professor-add"
  );
  const [personModalVisible, setPersonModalVisible] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);


  // estado para exibir modal de video
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [videoUrlAtual, setVideoUrlAtual] = useState<string | null>(null);

  // Estado Modal de comentario do professor

  const [comentarioModalVisible, setComentarioModalVisible] = useState(false);
  const [comentarioAtual, setComentarioAtual] = useState("");
  const [comentarioIndex, setComentarioIndex] = useState<number | null>(null);



  useEffect(() => {
    carregarTarefas();
    carregarNomeUsuario();
    // limparTarefasAoIniciar();
  }, []);

  const carregarNomeUsuario = async () => {
    try {
      const nome = await AsyncStorage.getItem("userName"); // ✅ mesma chave usada no cadastro
      if (nome) setNomeUsuario(nome);
    } catch (error) {
      console.log("Erro ao carregar nome do usuário:", error);
    }
  };


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

  const carregarTarefas = async () => {
    try {
      const chave = `tarefas_${turmaId}`;
      const armazenadas = await AsyncStorage.getItem(chave);

      if (armazenadas) {
        setTarefas(JSON.parse(armazenadas) as Tarefa[]);
      }
    } catch (error) {
      console.log("Erro ao carregar tarefas:", error);
    }
  };

  const salvarTarefas = async (listaAtualizada: Tarefa[]) => {
    try {
      const chave = `tarefas_${turmaId}`;
      await AsyncStorage.setItem(chave, JSON.stringify(listaAtualizada));
    } catch (error) {
      console.log("Erro ao salvar tarefas:", error);
    }
  };

  const limparTarefasAoIniciar = async () => {
    try {
      const chave = `tarefas_${turmaId}`;
      await AsyncStorage.removeItem(chave);
      setTarefas([]);
    } catch (error) {
      console.log("Erro ao limpar tarefas:", error);
    }
  };


  const adicionarTarefaProfessor = (tarefa: Tarefa) => {
    const listaAtualizada = [...tarefas, tarefa];
    setTarefas(listaAtualizada);
    salvarTarefas(listaAtualizada);
  };




  // const concluirTarefaAluno = (videoUrl: string) => {
  //   if (selectedIndex === null) return;

  //   const listaAtualizada = [...tarefas];
  //   listaAtualizada[selectedIndex].conclusaoAluno = videoUrl;
  //   listaAtualizada[selectedIndex].concluida = true;

  //   setTarefas(listaAtualizada);
  //   salvarTarefas(listaAtualizada);
  // };

  // Função para salvar/baixar PDF
  
  // const salvarPdfNoCelular = async (uri: string) => {
  //   try {
  //     const nomeArquivo = uri.split("/").pop() || "arquivo.pdf";

  //     // Fallback universal (funciona em TODAS as versões do Expo)
  //     const destino = FileSystem.cacheDirectory + nomeArquivo;

  //     await FileSystem.copyAsync({
  //       from: uri,
  //       to: destino,
  //     });

  //       alert("PDF salvo na pasta interna (cache) da aplicação!");
  //     } catch (error) {
  //       console.log("Erro ao salvar PDF:", error);
  //       alert("Não foi possível salvar o PDF.");
  //     }
  // };

  // Função para salvar PDF na cache e compartilhar


  const concluirTarefaAluno = async (videoUrl: string) => {
    if (selectedIndex === null) return;

    const nomeAluno = await AsyncStorage.getItem("userName");

    const listaAtualizada = [...tarefas];

    listaAtualizada[selectedIndex].conclusaoAluno = videoUrl;
    listaAtualizada[selectedIndex].concluida = true;
    listaAtualizada[selectedIndex].alunoNome = nomeAluno ?? "Aluno";

    setTarefas(listaAtualizada);
    salvarTarefas(listaAtualizada);
  };

  // Salvar comentário do professor

  const salvarComentarioProfessor = () => {
    if (comentarioIndex === null) return;

    const listaAtualizada = [...tarefas];
    listaAtualizada[comentarioIndex].comentarioProfessor = comentarioAtual;

    setTarefas(listaAtualizada);
    salvarTarefas(listaAtualizada);

    setComentarioModalVisible(false);
    setComentarioAtual("");
    setComentarioIndex(null);
  };



  return (
    <View style={styles.container}>
      {!drawerOpen && (
        <>
          <View style={styles.rowButtons}>
            <TouchableOpacity onPress={openDrawer} style={styles.btnDrawer}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>

            {userType === "Professor" && (
              <>
                <TouchableOpacity
                  style={styles.addTaskButton}
                  onPress={() => {
                    setModalMode("professor-add");
                    setModalVisible(true);
                  }}
                >
                  <ClipboardList size={26} color="#fff" />
                  {/* <Plus size={26} color="#fff" /> */}
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity onPress={() => setSecao("tarefas")} style={[styles.tabButton, secao === "tarefas" && styles.tabActive]}>
              <Text style={[styles.tabText, secao === "tarefas" && styles.tabTextActive]}>Tarefas</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSecao("concluidas")} style={[styles.tabButton, secao === "concluidas" && styles.tabActive]}>
              <Text style={[styles.tabText, secao === "concluidas" && styles.tabTextActive]}>Concluídas</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSecao("participantes")} style={[styles.tabButton, secao === "participantes" && styles.tabActive]}>
              <Text style={[styles.tabText, secao === "participantes" && styles.tabTextActive]}>Participantes</Text>
            </TouchableOpacity>
          </View>


          {/* <Text style={styles.sectionTitle}>Tarefas da Turma</Text> */}

          {/* SEÇÃO: TAREFAS */}
          {secao === "tarefas" && (
            <>
              {tarefas.length === 0 ? (
                <Text style={styles.noTasks}>Nenhuma tarefa cadastrada.</Text>
              ) : (
                <FlatList
                  data={tarefas.filter(t => !t.concluida)}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View
                      style={[
                        styles.taskItem,
                        item.concluida ? styles.taskCompleted : null,
                      ]}
                    >
                      <Text style={styles.taskText}>• {item.texto}</Text>

                      {item.referenciaVideo && (
                        <TouchableOpacity
                          onPress={() => {
                            setVideoUrlAtual(item.referenciaVideo || null);
                            setVideoModalVisible(true);
                          }}
                        >
                          <Text style={{ color: "#2563EB", marginTop: 4 }}>
                            ▶ Assistir vídeo do professor
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* ✅ NOVO BLOCO — BAIXAR PDF */}
                      {item.referenciaPdf && (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(item.referenciaPdf!)}  
                        >
                          <Text style={{ color: "#9333EA", marginTop: 6 }}>
                            📄 Baixar PDF da tarefa
                          </Text>
                        </TouchableOpacity>
                      )}
                      {/* ---------------------------- */}

                      {userType === "Aluno" && !item.concluida && (
                        <TouchableOpacity
                          style={styles.btnConcluir}
                          onPress={() => {
                            const indexReal = tarefas.indexOf(item); 
                            setSelectedIndex(indexReal);
                            setModalMode("aluno-confirm");
                            setModalVisible(true);
                          }}

                        >
                          <CheckCircle size={26} color="green" />
                        </TouchableOpacity>
                      )}

                      {item.conclusaoAluno && (
                        <Text style={{ marginTop: 4, color: "green" }}>
                          ✔ Tarefa concluída com vídeo
                        </Text>
                      )}
                    </View>
                  )}
                />
              )}
            </>
          )}

          {/* SEÇÃO: CONCLUÍDAS */}
          {secao === "concluidas" && (
            <>
              {tarefas.filter(t => t.concluida).length === 0 ? (
                <Text style={styles.noTasks}>Nenhuma tarefa concluída.</Text>
              ) : (
                <FlatList
                  data={tarefas.filter(t => t.concluida)}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View style={[styles.taskItem, styles.taskCompleted]}>
                      
                      <Text style={styles.taskText}>• {item.texto}</Text>

                      {/* Nome do aluno */}
                      {item.conclusaoAluno && (
                        <>
                          <Text style={{ marginTop: 4 }}>
                            ✔ Enviado por: <Text style={{ fontWeight: "bold" }}>{item.alunoNome}</Text>
                          </Text>

                          {/* Vídeo do aluno */}
                          <TouchableOpacity
                            onPress={() => {
                              setVideoUrlAtual(item.conclusaoAluno!);
                              setVideoModalVisible(true);
                            }}
                          >
                            <Text style={{ color: "#2563EB", marginTop: 4 }}>
                              ▶ Assistir vídeo do aluno
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}

                      {/* Comentário visível para qualquer um */}
                      {item.comentarioProfessor && (
                        <Text style={{ marginTop: 6, fontStyle: "italic", color: "#444" }}>
                          💬 Comentário do professor: {item.comentarioProfessor}
                        </Text>
                      )}

                      {/* Botão de comentário — somente professor */}
                      {userType === "Professor" && (
                        <TouchableOpacity
                          style={{
                            marginTop: 10,
                            backgroundColor: "#2563EB",
                            padding: 8,
                            borderRadius: 8,
                            alignSelf: "flex-start",
                          }}
                          onPress={() => {
                            const indexReal = tarefas.indexOf(item);
                            setComentarioIndex(indexReal);
                            setComentarioAtual(item.comentarioProfessor ?? "");
                            setComentarioModalVisible(true);
                          }}
                        >
                          <Text style={{ color: "white" }}>Adicionar comentário</Text>
                        </TouchableOpacity>
                      )}

                    </View>
                  )}
                />
              )}
            </>
          )}


          {/* SEÇÃO: PARTICIPANTES */}
          {secao === "participantes" && <Participantes />}

        </>
      )}

      <MenuLateral
        open={drawerOpen}
        onClose={closeDrawer}
        drawerAnim={drawerAnim}
        turmaNome={turmaNome}
        turmaId={turmaId}
        nomeLocal={nomeUsuario}
        tipoLocal={userType}
      />

      <ModalAdicionarTarefa
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={modalMode}
        onConfirmProfessor={adicionarTarefaProfessor}
        onConfirmAluno={concluirTarefaAluno}
      />

      {/* Modal para ver video */}

      <ModalVideo
        visible={videoModalVisible}
        videoUrl={videoUrlAtual}
        onClose={() => setVideoModalVisible(false)}
      />

      <ModalComentario 
        visible={comentarioModalVisible}
        comentario={comentarioAtual}
        setComentario={setComentarioAtual}
        onCancel={() => setComentarioModalVisible(false)}
        onSave={salvarComentarioProfessor}
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
    paddingHorizontal: 10,
    marginTop: 40,
  },

  sectionTitle: {
    fontSize: 18,
    marginTop: 25,
    fontWeight: "bold",
  },

  noTasks: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#666",
  },

  taskItem: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#ccc",
  },

  taskCompleted: {
    borderColor: "green",
  },

  taskText: { fontSize: 16 },

  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 10,
    width: 50,
  },

  btnDrawer: {
    backgroundColor: "#6A1B9A",
    padding: 8,
    borderRadius: 8,
  },

  btnConcluir: {
    marginTop: 10,
    alignSelf: "flex-end",
  },




  // NOVOS ESTILOS
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },

  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  tabActive: {
    backgroundColor: "#4A90E2",
  },

  tabText: {
    color: "#aaa",
    fontSize: 16,
  },

  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

});
