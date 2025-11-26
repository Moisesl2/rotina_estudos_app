import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import * as DocumentPicker from "expo-document-picker"; // ✅ ADICIONADO
import * as ImagePicker from "expo-image-picker";

interface Tarefa {
  texto: string;
  referenciaVideo?: string;
  referenciaPdf?: string; // ✅ ADICIONADO
  conclusaoAluno?: string;
}

interface Props {
  visible: boolean;
  mode: "professor-add" | "aluno-confirm";
  onClose: () => void;
  onConfirmProfessor: (tarefa: Tarefa) => void;
  onConfirmAluno: (videoUrl: string) => void;
}

export default function ModalAdicionarTarefa({
  visible,
  mode,
  onClose,
  onConfirmProfessor,
  onConfirmAluno,
}: Props) {
  const [texto, setTexto] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState(""); // ✅ ADICIONADO

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      setVideoUrl(result.assets[0].uri);
    }
  };

  // ✅ NOVO MÉTODO PARA PDF
  const pickPdf = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.assets && result.assets.length > 0) {
      setPdfUrl(result.assets[0].uri);
    }
  };

  const handleConfirm = () => {
    if (mode === "professor-add") {
      if (!texto) return;

      onConfirmProfessor({
        texto,
        referenciaVideo: videoUrl,
        referenciaPdf: pdfUrl, // ✅ ADICIONADO
      });

      setTexto("");
      setVideoUrl("");
      setPdfUrl(""); // ✅ ADICIONADO
      onClose();
    }

    if (mode === "aluno-confirm") {
      if (!videoUrl) return;

      onConfirmAluno(videoUrl);

      setVideoUrl("");
      onClose();
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {mode === "professor-add" && (
            <>
              <Text style={styles.title}>Adicionar nova tarefa</Text>
              <TextInput
                style={styles.input}
                placeholder="Descrição da tarefa"
                value={texto}
                onChangeText={setTexto}
              />
            </>
          )}

          {mode === "aluno-confirm" && (
            <Text style={styles.title}>Enviar vídeo da tarefa concluída</Text>
          )}

          <TouchableOpacity style={styles.btnVideo} onPress={pickVideo}>
            <Text style={{ color: "#fff" }}>Selecionar vídeo da galeria</Text>
          </TouchableOpacity>

          {videoUrl !== "" && (
            <Text style={{ marginTop: 10, color: "green" }}>
              Vídeo selecionado ✔
            </Text>
          )}

          {/* ✅ BOTÃO NOVO PARA PDF */}
          {mode === "professor-add" && (
            <>
              <TouchableOpacity
                style={[styles.btnVideo, { marginTop: 10, backgroundColor: "#6D28D9" }]}
                onPress={pickPdf}
              >
                <Text style={{ color: "#fff" }}>Selecionar PDF</Text>
              </TouchableOpacity>

              {pdfUrl !== "" && (
                <Text style={{ marginTop: 10, color: "purple" }}>
                  PDF selecionado ✔
                </Text>
              )}
            </>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirm]}
              onPress={handleConfirm}
            >
              <Text style={styles.btnText}>Confirmar</Text>
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
    marginBottom: 15,
  },
  btnVideo: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
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
