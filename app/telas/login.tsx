import { useRouter } from "expo-router";
import { GraduationCap, Users } from "lucide-react-native"; // ÍCONES AQUI
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoginModal from "./LoginModal";

function login() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [userType, setUserType] = useState<"Professor" | "Aluno">("Professor");

  const openModal = (type: "Professor" | "Aluno") => {
    setUserType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Bem-vindo(a) ao nosso aplicativo</Text>

        {/* Botão Professor */}
        <TouchableOpacity
          style={[styles.roleButton, { backgroundColor: "#2563EB" }]}
          onPress={() => openModal("Professor")}
        >
          <GraduationCap size={26} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.roleButtonText}>Sou Professor</Text>
        </TouchableOpacity>

        {/* Botão Aluno */}
        <TouchableOpacity
          style={[styles.roleButton, { backgroundColor: "#7C3AED" }]}
          onPress={() => openModal("Aluno")}
        >
          <Users size={26} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.roleButtonText}>Sou Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/telas/cadastro")}
        >
          <Text style={styles.registerText}>
            Não tem conta? <Text style={styles.registerLink}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <LoginModal
        visible={modalVisible}
        onClose={closeModal}
        userType={userType}
        onLoginSuccess={(user) => {
          router.push({
            pathname: "/telas/homescreen",
            params: { userType: user }
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  innerContainer: {
    width: "100%",
    maxWidth: 360,
    gap: 24,
  },
  title: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 48,
  },
  roleButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  roleButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 16,
    alignItems: "center",
  },
  registerText: {
    color: "#FFF",
    fontSize: 16,
  },
  registerLink: {
    color: "#FFD700",
    fontWeight: "bold",
  },
});

export default login;
