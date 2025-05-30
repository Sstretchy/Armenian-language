import React, {useCallback, useState} from 'react';
import {WordList} from '../components/WordList.tsx';
import {getLearningWords} from '../database/learningWords.ts';
import {Word} from '../types/TWord.ts';
import Loader from '../components/Loader.tsx';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {StartButton} from '../components/StartButton.tsx';
import { useFocusEffect } from '@react-navigation/native';

export const WordsToLearn = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
  
      const fetchData = async () => {
        try {
          const fetchedWords = await getLearningWords();
            setWords(fetchedWords.map(word => ({ ...word })));
        } catch (err) {
          console.log('Ошибка загрузки слов:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
  
      return () => {
        setWords([]);
      };
    }, [])
  );

  return (
    <>
      {loading && <Loader />}
      <Text style={styles.title}>{'Слова на изучение'}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WordList
          words={words}
          emptyMessage="Слов на изучение нет"
        />
      </ScrollView>
      <StartButton />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {padding: 16, paddingBottom: 80},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
});
