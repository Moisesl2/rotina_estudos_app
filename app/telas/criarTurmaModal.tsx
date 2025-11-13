import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface CriarTurmaModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (nomeTurma: string) => void;
  cardTitulo: string;
}

const CriarTurmaModal = ({ visible, onClose, onConfirm, cardTitulo }: CriarTurmaModalProps) => {
  const [nomeTurma, setNomeTurma] = useState("");

  const handleConfirm = () => {
    if (!nomeTurma.trim()) return; // validação simples
    onConfirm(nomeTurma.trim());
    setNomeTurma("");
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Criar nova turma - {cardTitulo}</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da turma"
            value={nomeTurma}
            onChangeText={setNomeTurma}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CriarTurmaModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  buttons: { flexDirection: "row", justifyContent: "space-between" },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
  cancel: { backgroundColor: "#ccc" },
  confirm: { backgroundColor: "#DC2626" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
