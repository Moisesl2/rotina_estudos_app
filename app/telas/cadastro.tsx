import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Cadastro() {
  const router = useRouter();
  const [tipoConta, setTipoConta] = useState<'Aluno' | 'Professor'>('Aluno'); 
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastrar = async () => {
    if (!nome || !email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      // Salva os dados do usuário no AsyncStorage
      await AsyncStorage.setItem("userName", nome);
      await AsyncStorage.setItem("userType", tipoConta);
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userPassword", senha); // opcional, se quiser salvar a senha local

      // Redireciona para a tela de Login
      router.push("/telas/login");
    } catch (error) {
      console.log("Erro ao salvar usuário:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      {/* Seleção do tipo de conta */}
      <View style={styles.checkboxGroup}>
        <View style={styles.checkboxOption}>
          <Checkbox
            value={tipoConta === 'Aluno'}
            onValueChange={() => setTipoConta('Aluno')}
            color={tipoConta === 'Aluno' ? '#e63946' : undefined}
          />
          <Text style={styles.checkboxLabel}>Aluno</Text>
        </View>
        <View style={styles.checkboxOption}>
          <Checkbox
            value={tipoConta === 'Professor'}
            onValueChange={() => setTipoConta('Professor')}
            color={tipoConta === 'Professor' ? '#e63946' : undefined}
          />
          <Text style={styles.checkboxLabel}>Professor</Text>
        </View>
      </View>

      {/* Campos de cadastro */}
      <TextInput
        style={styles.input}
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão cadastrar */}
      <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Link para login */}
      <TouchableOpacity onPress={() => router.push("/telas/login")}>
        <Text style={styles.link}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  checkboxGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#e63946',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#007bff',
  },
});
