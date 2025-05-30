import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {armenianAlphabet} from '../data/alphabet';

export const Alphabet = ({modalVisible, setModalVisible}: any) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>📖 Армянский алфавит</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerCell, {textAlign: 'left'}]}>
              Буква
            </Text>
            <Text
              style={[styles.cell, styles.headerCell, {textAlign: 'center'}]}>
              Звук
            </Text>
            <Text
              style={[styles.cell, styles.headerCell, {textAlign: 'right'}]}>
              Пример
            </Text>
          </View>

          {/* Прокручиваемый список букв */}
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {armenianAlphabet.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.cell, {textAlign: 'left'}]}>
                  {item.letter}
                </Text>
                <Text style={[styles.cell, {textAlign: 'center'}]}>
                  {item.sound}
                </Text>
                <Text style={[styles.cell, {textAlign: 'right'}]}>
                  {item.example}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* 🔹 Кнопка закрытия */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxHeight: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3f51b5',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8,
    color: 'black',
    marginTop: 10,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 6,
    paddingHorizontal: 6,
    flex: 1,
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
