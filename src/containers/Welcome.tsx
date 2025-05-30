import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {loadCorrectAnswersGoal} from '../storage/settingsStorage';
import {StartButton} from '../components/StartButton';
import {useFocusEffect} from '@react-navigation/native';

export const Welcome = () => {
  const [correctAnswers, setCorrectAnswers] = useState('10');

  useFocusEffect(
    useCallback(() => {
      const fetchCorrectAnswers = async () => {
        const savedValue = await loadCorrectAnswersGoal();
        setCorrectAnswers(savedValue.toString());
      };

      fetchCorrectAnswers();
    }, []),
  );

  return (
    <>
      <Text style={styles.title}>Добро пожаловать!</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.description}>
          Это приложение предназначено для обучения армянскому языку через
          монотонное повторение и перевод слов. Вначале вам будет предложено 20
          слов для изучения. После того как вы правильно переведёте каждое из
          них заданное количество раз (
          <Text style={styles.highlight}>N раз</Text>), слово будет считаться
          выученным и перемещено в список выученных слов.
        </Text>
        <Text style={styles.description}>
          Когда количество слов для изучения уменьшится до 10, алгоритм
          автоматически добавит ещё 20 новых слов в список для продолжения
          обучения.
        </Text>
        <Text style={styles.description}>
          Пожалуйста, обратите внимание на количество правильных переводов,
          необходимое для того, чтобы слово считалось выученным. Вы сможете
          изменить это значение в настройках в любое время.
        </Text>

        {/* Ввод данных */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Количество правильных ответов сейчас:{' '}
            <Text style={{fontWeight: 800}}>{correctAnswers}</Text>
          </Text>
        </View>
      </ScrollView>
      <StartButton />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 24,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  inputContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
});
