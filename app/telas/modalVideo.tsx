import { ResizeMode, Video } from "expo-av";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModalVideoProps {
  visible: boolean;
  videoUrl: string | null;
  onClose: () => void;
}

export default function ModalVideo({ visible, videoUrl, onClose }: ModalVideoProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}

            />
          ) : (
            <Text style={{ color: "#fff" }}>Nenhum vídeo disponível</Text>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 300,
    backgroundColor: "#000",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
  },
  closeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
