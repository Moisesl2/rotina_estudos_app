import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Cadastro() {
  const router = useRouter();
  const [tipoConta, setTipoConta] = useState('aluno'); // valor inicial

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
        <View style={styles.checkboxGroup}>
            <View style={styles.checkboxOption}>
                <Checkbox
                    value={tipoConta === 'aluno'}
                    onValueChange={() => setTipoConta('aluno')}
                    color={tipoConta === 'aluno' ? '#e63946' : undefined}
                />
                <Text style={styles.checkboxLabel}>Aluno</Text>
            </View>
            <View style={styles.checkboxOption}>
                <Checkbox
                    value={tipoConta === 'professor'}
                    onValueChange={() => setTipoConta('professor')}
                    color={tipoConta === 'professor' ? '#e63946' : undefined}
                />
                <Text style={styles.checkboxLabel}>Professor</Text>
            </View>
        </View>

        <TextInput style={styles.input} placeholder="Nome completo" />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry />



        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.navigate("/telas/login")}>
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
