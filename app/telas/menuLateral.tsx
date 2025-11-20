import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

interface MenuLateralProps {
  open: boolean;
  onClose: () => void;
  drawerAnim: Animated.Value;
  turmaNome: string;
  turmaId: string;
  nomeLocal: string;
  tipoLocal: string;
}

export default function MenuLateral({
  open,
  onClose,
  drawerAnim,
  turmaNome,
  turmaId,
  nomeLocal,
  tipoLocal,
}: MenuLateralProps) {
  return (
    <>
      {/* Sobreposição escura quando aberto */}
      {open && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      )}

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <Text style={styles.drawerTitle}>Informações do Usuário</Text>

        <Text style={styles.drawerItem}>Turma: {turmaNome}</Text>
        <Text style={styles.drawerItem}>ID da Turma: {turmaId}</Text>
        <Text style={styles.drawerItem}>Usuário: {nomeLocal}</Text>
        <Text style={styles.drawerItem}>Tipo: {tipoLocal}</Text>

        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Ionicons name="close" size={26} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    zIndex: 20,
    elevation: 5,
  },

  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 40,
  },

  drawerItem: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },

  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#6A1B9A",
    padding: 6,
    borderRadius: 50,
  },
});
