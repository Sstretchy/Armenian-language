import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  loadCorrectAnswersGoal,
  saveCorrectAnswersGoal,
} from '../storage/settingsStorage';
import {StartButton} from '../components/StartButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';

export const Settings = () => {
  const [correctAnswers, setCorrectAnswers] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      const fetchCorrectAnswers = async () => {
        try {
          const savedValue = await loadCorrectAnswersGoal();
          setCorrectAnswers(savedValue.toString());
        } catch (error) {
          console.error('Ошибка загрузки значения:', error);
        }
      };

      fetchCorrectAnswers();
    }, []),
  );

  const handleSave = async () => {
    const value = parseInt(correctAnswers, 10);
    if (!isNaN(value) && value > 0) {
      try {
        await saveCorrectAnswersGoal(value);
        setCorrectAnswers(value.toString());
        Alert.alert('Настройки сохранены', `Установлено значение: ${value}`);
      } catch (error) {
        console.error('Ошибка сохранения значения:', error);
        Alert.alert('Ошибка', 'Не удалось сохранить значение.');
      }
    } else {
      Alert.alert(
        'Некорректное значение',
        'Введите корректное положительное число.',
      );
    }

    Keyboard.dismiss();
  };

  // Обработчик изменения текста в поле ввода
  const handleInputChange = (text: string) => {
    // Удаляем всё, кроме цифр
    const filteredText = text.replace(/[^0-9]/g, '');
    // Если текст равен "0", заменяем на пустую строку
    if (filteredText === '0') {
      setCorrectAnswers('');
    } else {
      setCorrectAnswers(filteredText);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.title}>Настройки</Text>

          <Text style={styles.inputLabel}>
            Укажите количество правильных ответов для перемещения слова в список
            выученных:
          </Text>

          <View style={styles.inputContainer}>
            <View style={{flex: 1}}>
              <TextInput
                style={styles.input}
                value={correctAnswers}
                keyboardType="numeric"
                onChangeText={handleInputChange}
              />
            </View>
            <TouchableOpacity style={styles.sendButton} onPress={handleSave}>
              <Icon name="save" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <StartButton />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputContainer: {
    marginTop: 24,
    marginBottom: 24,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    width: '100%',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  sendButton: {
    backgroundColor: '#3f51b5',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    height: 50,
    width: 50,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
