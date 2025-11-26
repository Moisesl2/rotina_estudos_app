
import {
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface Props {
  visible: boolean;
  comentario: string;
  setComentario: (text: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ModalComentario({
  visible,
  comentario,
  setComentario,
  onCancel,
  onSave
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            padding: 20,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Comentário do professor
          </Text>

          <TextInput
            value={comentario}
            onChangeText={setComentario}
            multiline
            placeholder="Escreva o feedback..."
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 10,
              padding: 10,
              minHeight: 80,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 15,
            }}
          >
            <TouchableOpacity onPress={onCancel} style={{ padding: 10 }}>
              <Text>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSave}
              style={{
                backgroundColor: "#2563EB",
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Salvar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
