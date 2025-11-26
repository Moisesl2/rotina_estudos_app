import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Usuario {
  id: string;
  nome: string;
  tipo: "Aluno" | "Professor";
  foto?: string;
}

export default function Participantes() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // NOVO ESTADO PARA SABER SE O USUÁRIO LOGADO É PROFESSOR
  const [userTypeLogado, setUserTypeLogado] = useState<"Aluno" | "Professor" | null>(null); // <<< ADICIONADO

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState<"professor" | "aluno" | null>(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const nome = await AsyncStorage.getItem("userName");
      const tipo = await AsyncStorage.getItem("userType");

      setUserTypeLogado(tipo as "Aluno" | "Professor"); // <<< ADICIONADO

      const usuarioCadastrado: Usuario | null =
        nome && tipo
          ? { id: "0", nome, tipo: tipo as "Aluno" | "Professor" }
          : null;

      const listaFixa: Usuario[] = [
        { id: "1", nome: "Professor João", tipo: "Professor" },
        { id: "2", nome: "Maria Silva", tipo: "Aluno" },
        { id: "3", nome: "Carlos Santos", tipo: "Aluno" },
        { id: "4", nome: "Ana Clara", tipo: "Aluno" },
      ];

      const listaFinal = usuarioCadastrado
        ? [usuarioCadastrado, ...listaFixa]
        : listaFixa;

      setUsuarios(listaFinal);
    } catch (error) {
      console.log("Erro ao carregar participantes:", error);
    }
  };

  const professores = usuarios.filter((u) => u.tipo === "Professor");
  const alunos = usuarios.filter((u) => u.tipo === "Aluno");

  return (
    <View style={styles.container}>
      {/* -------------------- EDUCADORES -------------------- */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Educadores</Text>

        {/* SOMENTE PROFESSOR VÊ ESTE BOTÃO */}
        {userTypeLogado === "Professor" && ( // <<< ADICIONADO
          <TouchableOpacity
            onPress={() => {
              setModalTipo("professor");
              setModalVisible(true);
            }}
          >
            <Ionicons name="person-add-outline" size={22} color="#222" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={professores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemParticipante item={item} />}
      />

      {/* -------------------- ESTUDANTES -------------------- */}
      <View style={[styles.headerRow, { marginTop: 20 }]}>
        <Text style={styles.sectionTitle}>Estudantes</Text>

        {/* SOMENTE PROFESSOR VÊ ESTE BOTÃO */}
        {userTypeLogado === "Professor" && ( // <<< ADICIONADO
          <TouchableOpacity
            onPress={() => {
              setModalTipo("aluno");
              setModalVisible(true);
            }}
          >
            <Ionicons name="person-add-outline" size={22} color="#222" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ItemParticipante item={item} />}
      />

      <AdicionarParticipanteModal
        visible={modalVisible}
        tipo={modalTipo}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

/* ------------------------------------------------------------------
  COMPONENTE DO PARTICIPANTE
------------------------------------------------------------------- */

function ItemParticipante({ item }: { item: Usuario }) {
  const inicial = item.nome.charAt(0).toUpperCase();

  return (
    <View style={styles.itemRow}>
      {item.foto ? (
        <Image source={{ uri: item.foto }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={styles.nome} numberOfLines={1}>
          {item.nome}
        </Text>

        {item.tipo === "Aluno" ? (
          <Text style={styles.convidadoText}>(convidado)</Text>
        ) : null}
      </View>

      <TouchableOpacity>
        <Ionicons name="ellipsis-vertical" size={20} color="#222" />
      </TouchableOpacity>
    </View>
  );
}

/* ------------------------------------------------------------------
   >>>>>>>>>>>>>>>>> MODAL NOVO <<<<<<<<<<<<<<<<<<<<<<
------------------------------------------------------------------- */

function AdicionarParticipanteModal({
  visible,
  tipo,
  onClose,
}: {
  visible: boolean;
  tipo: "professor" | "aluno" | null;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");

  const handleAdicionar = () => {
    if (!email.trim()) {
      alert("Digite um e-mail válido.");
      return;
    }

    console.log("E-mail enviado:", email);

    // Aqui você pode enviar para API, salvar, etc.

    setEmail(""); // limpar
    onClose(); // fechar modal
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Adicionar {tipo === "professor" ? "Educador" : "Estudante"}
          </Text>

          {/* INPUT */}
          <TextInput
            placeholder="Digite o e-mail do convidado"
            placeholderTextColor="#777"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* BOTÃO ADICIONAR */}
          <TouchableOpacity style={styles.modalButton} onPress={handleAdicionar}>
            <Text style={styles.modalButtonText}>Adicionar</Text>
          </TouchableOpacity>

          {/* BOTÃO FECHAR */}
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: "#666", marginTop: 10 }]}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


/* ------------------------------------------------------------------
   ESTILOS
------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 12,
  },

  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#4a4a4a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  nome: {
    color: "#222",
    fontSize: 16,
    fontWeight: "500",
  },

  convidadoText: {
    color: "#aaa",
    fontSize: 12,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },

  modalButton: {
    marginTop: 20,
    backgroundColor: "#222",
    paddingVertical: 10,
    borderRadius: 6,
  },

  modalButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 15,
    fontSize: 16,
    color: "#222",
  },

});
