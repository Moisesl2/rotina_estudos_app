/**
 * LoginModal Component (React Native)
 * Modal de login com validação de campos para Professor ou Aluno
 */

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
  onLoginSuccess: (userType: "Professor" | "Aluno") => void; // <- nova prop
}

export default function LoginModal({
  visible,
  onClose,
  userType,
  onLoginSuccess, // <- aqui!
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert("Preencha todos os campos");
      return;
    }

    // Simula login bem-sucedido
    alert(`Login bem-sucedido como ${userType}!`);

    // Chama callback de login bem-sucedido
    onLoginSuccess(userType);

    // Limpa campos e fecha modal
    setEmail("");
    setPassword("");
    onClose();
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
          {/* Botão de fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#666" />
          </TouchableOpacity>

          {/* Título */}
          <Text style={styles.title}>Login - {userType}</Text>

          {/* Campo de email */}
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

          {/* Campo de senha */}
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

          {/* Botão de login */}
          <CustomButton title="Entrar" onPress={handleLogin} color="#DC2626" />

          {/* Texto informativo */}
          <Text style={styles.footerText}>
            Apenas usuários cadastrados podem acessar o aplicativo.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 380,
    padding: 20,
    position: "relative",
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 10,
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    marginTop: 12,
  },
});
