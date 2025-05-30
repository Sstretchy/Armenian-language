import React, {Dispatch, SetStateAction} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Word} from '../types/TWord';
import {moveLearnedWordToLearning} from '../database/learnedWords';

export const RenderLearnedWord = ({
  item,
  setWords,
}: {
  item: Word;
  setWords: Dispatch<SetStateAction<Word[]>>;
}) => {
  // Функция для возврата слова в список на обучение
  const handleReturnToLearning = async () => {
    try {
      Alert.alert('Возвращение слова', 'Вернуть слово в список на изучение?', [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Вернуть',
          onPress: async () => {
            await moveLearnedWordToLearning(item.id); // Перемещаем слово обратно
            setWords(prevWords => prevWords.filter(w => w.id !== item.id));
            console.log(`✅ Слово ${item.armenian} возвращено в обучение`);
          },
        },
      ]);
    } catch (error) {
      console.error('Ошибка при возврате слова:', error);
    }
  };

  return (
    <View style={styles.wordContainer}>
      <Text style={styles.wordText}>
        {`${item.armenian.charAt(0).toUpperCase() + item.armenian.slice(1)} [${
          item.transcription
        }] — ${item.translation.join(', ')}`}
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleReturnToLearning}>
        <Icon name="undo" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  button: {
    backgroundColor: '#3f51b5',
    padding: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    height: 36,
  },
});
