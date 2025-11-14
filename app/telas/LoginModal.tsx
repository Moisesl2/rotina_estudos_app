import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeOff, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import CustomButton from "./CustomButton";

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
  userType: "Professor" | "Aluno";
  onLoginSuccess: (userType: "Professor" | "Aluno", userName: string) => void;
}

export default function LoginModal({
  visible,
  onClose,
  userType,
  onLoginSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      const savedEmail = await AsyncStorage.getItem("userEmail");
      const savedPassword = await AsyncStorage.getItem("userPassword");
      const savedUserType = await AsyncStorage.getItem("userType");
      const savedUserName = await AsyncStorage.getItem("userName");

      if (
        email === savedEmail &&
        password === savedPassword &&
        userType === savedUserType
      ) {
        // Login válido
        onLoginSuccess(userType, savedUserName || "");
        setEmail("");
        setPassword("");
        onClose();
      } else {
        alert("Email, senha ou tipo de conta incorretos!");
      }
    } catch (error) {
      console.log("Erro ao validar login:", error);
      alert("Erro ao tentar fazer login");
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#666" />
          </TouchableOpacity>

          <Text style={styles.title}>Login - {userType}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color="#555" /> : <Eye size={20} color="#555" />}
              </TouchableOpacity>
            </View>
          </View>

          <CustomButton title="Entrar" onPress={handleLogin} color="#DC2626" />

          <Text style={styles.footerText}>
            Apenas usuários cadastrados podem acessar o aplicativo.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 16 },
  modalContainer: { backgroundColor: "#fff", borderRadius: 12, width: "100%", maxWidth: 380, padding: 20, position: "relative", elevation: 5 },
  closeButton: { position: "absolute", right: 16, top: 16, zIndex: 10 },
  title: { textAlign: "center", fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: "#444", marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  passwordContainer: { flexDirection: "row", alignItems: "center" },
  eyeButton: { position: "absolute", right: 10 },
  footerText: { textAlign: "center", color: "#666", fontSize: 13, marginTop: 12 },
});
