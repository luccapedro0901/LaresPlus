import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function ModalPicker({ label, selectedValue, options, onSelect }) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (item) => {
    onSelect(item.value);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectBox} onPress={() => setVisible(true)}>
        <Text style={styles.selectedText}>
          {options.find((opt) => opt.value === selectedValue)?.label || "Selecione uma opção"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{label}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity onPress={() => setVisible(false)} style={styles.fecharBtn}>
              <Text style={styles.fecharText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5, fontWeight: "600" },
  selectBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
  },
  selectedText: { color: "#333" },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: { fontSize: 16, textAlign: "center" },
  fecharBtn: {
    marginTop: 10,
    backgroundColor: "#1E6FF2",
    borderRadius: 8,
    paddingVertical: 10,
  },
  fecharText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
