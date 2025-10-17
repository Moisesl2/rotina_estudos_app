import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
    const router = useRouter();

    const handleProfessorLogin = () => {
        // No futuro: router.push("/professor")
        alert("Login como Professor");
    };

    const handleAlunoLogin = () => {
        // No futuro: router.push("/aluno")
        alert("Login como Aluno");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Área de Login</Text>
            <Text style={styles.subtitle}>Selecione seu tipo de acesso</Text>

            <TouchableOpacity style={[styles.button, styles.professorButton]} onPress={handleProfessorLogin}>
                <Text style={styles.buttonText}>Entrar como Professor</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.alunoButton]} onPress={handleAlunoLogin}>
                <Text style={styles.buttonText}>Entrar como Aluno</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/telas/cadastro')}> 
                <Text style={styles.link}>Não tem uma conta? Cadastre-se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#1d3557",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 40,
    },
    button: {
        width: "100%",
        height: 55,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    professorButton: {
        backgroundColor: "#e63946", // vermelho suave
    },
    alunoButton: {
        backgroundColor: "#457b9d", // azul suave
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    link: {
        color: '#007bff',
        marginTop: 8,
    },
});
