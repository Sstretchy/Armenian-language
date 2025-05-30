import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Word} from '../types/TWord';

interface WordListProps {
  words: Word[];
  emptyMessage?: string;
}

export const WordList: React.FC<WordListProps> = ({words, emptyMessage}) => {
  return (
    <>
      {!words.length ? (
        <Text style={styles.label}>{emptyMessage}</Text>
      ) : (
        words.map((item, index) => (
          <View key={item.id} style={styles.wordContainer}>
            <Text style={styles.word}>
              {`${index + 1}) ${
                item.armenian.charAt(0).toUpperCase() + item.armenian.slice(1)
              } [${item.transcription}] — ${item.translation.join(", ")}`}
            </Text>
          </View>
        ))
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  word: {
    fontSize: 16,
    color: '#333',
  },
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
  },
});
