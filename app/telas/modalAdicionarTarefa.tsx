import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ModalAdicionarProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (tarefa: string) => void;
}

export default function ModalAdicionarTarefa({
  visible,
  onClose,
  onConfirm,
}: ModalAdicionarProps) {
  const [texto, setTexto] = useState("");

  const handleConfirm = () => {
    if (!texto.trim()) return;
    onConfirm(texto.trim());
    setTexto("");
    onClose();
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Adicionar nova tarefa</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite a tarefa"
            value={texto}
            onChangeText={setTexto}
          />

          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onClose}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.confirm]} onPress={handleConfirm}>
              <Text style={styles.btnText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bbb",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: "#aaa",
  },
  confirm: {
    backgroundColor: "#2563EB",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
