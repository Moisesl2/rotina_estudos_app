import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./CustomButton";
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
      {/* Container principal centralizado */}
      <View style={styles.innerContainer}>
        {/* Título da aplicação */}
        <Text style={styles.title}>Bem-vindo ao Sistema</Text>

        {/* Botão para Professor */}
        <CustomButton
          title="Professor"
          onPress={() => openModal("Professor")}
          color="#2563EB"
        />

        {/* Botão para Aluno */}
        <CustomButton
          title="Aluno"
          onPress={() => openModal("Aluno")}
          color="#7C3AED"
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/telas/cadastro")}
        >
          <Text style={styles.registerText}>
            Não tem conta? <Text style={styles.registerLink}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Login */}
      <LoginModal
        visible={modalVisible}
        onClose={closeModal}
        userType={userType}
        onLoginSuccess={(user) => {
          console.log('Login bem-sucedido, navegando para turmas');
          router.push({
            pathname: "/telas/homescreen",
            params: { userType: user } // passa tipo de usuário
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
