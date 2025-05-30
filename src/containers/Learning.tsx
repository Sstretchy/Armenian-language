import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  deleteLearningWord,
  getLearningWords,
  getRandomLearningWord,
  moveWordsToLearning,
  updateCorrectCount,
} from '../database/learningWords.ts.ts';
import {Word} from '../types/TWord.ts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {loadCorrectAnswersGoal} from '../storage/settingsStorage.js';
import {addLearnedWord} from '../database/learnedWords.ts';
import {Bubble} from '../components/Bubble.tsx';
import Loader from '../components/Loader.tsx';
import {DelayedBubble} from '../components/DelayedBubble.tsx';
import {WordList} from '../components/WordList.tsx';
import {NextButton} from '../components/NextButton.tsx';
import {useFocusEffect} from '@react-navigation/native';
import {Alphabet} from './Alphabet.tsx';

export const Learning = () => {
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [nextWord, setNextWord] = useState<Word | null>(null);
  const [correctAnswersGoal, setCorrectAnswersGoal] = useState(10);
  const [showInfoMenu, setShowInfoMenu] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [history, setHistory] = useState<
    {nextWord: Word; note: string | null; input: string | null}[]
  >([]);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    const fetchLearningWords = async () => {
      try {
        // Получаем слова из LearningWord стораджа
        setCorrectAnswersGoal(await loadCorrectAnswersGoal());
        const learningWords = (await getLearningWords()) as Word[];

        // Если слов нет (первая инициализация компонента), перемещаем из Word и обновляем список
        if (learningWords.length === 0) {
          await moveWordsToLearning();
          const newWords = await getLearningWords();

          setWords(newWords); // показываем новые слова для пользователя
          setShowInfoMenu(true); //открываем меню, в котором будем их отображать
        } else {
          setWords(learningWords); // показываем новые слова для пользователя
          setShowInfoMenu(false);
          getRandomWord();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLearningWords();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetch = async () => {
        setCorrectAnswersGoal(await loadCorrectAnswersGoal());
        const newWords = await getLearningWords();

        setWords(newWords);
      };

      fetch();
    }, []),
  );

  const handleNoLearningWords = () => {
    // если слов не осталось, закрываем все списки и поздравляем чувака
    setWords([]);
    setHistory([]);
    setShowInfoMenu(true);
  };

  const handleNewWordsToLearn = async (word: Word) => {
    // если слова меньше или равно 10, то подкидываем новых слов на изучение и показываем их список
    const newWordsLength = await moveWordsToLearning();
    const learningWords = await getLearningWords();

    // если новые слова для изучения кончились, продолжаем показывать остаток слов из массива на изучение
    if (!newWordsLength) {
      setNextWord(word);
      addToHistory(word);
      return;
    }

    // иначе показываем чуваку новую порцию слов
    setWords(learningWords.slice(-newWordsLength));
    setShowInfoMenu(true);
  };

  const addToHistory = (word: Word) => {
    // Добавляем слово в историю
    // @ts-ignore
    setHistory(prevHistory => [
      ...prevHistory,
      {nextWord: word, note: null, input: null},
    ]);
  };

  const handleNextWord = async (word: Word) => {
    // если слов больше 10, то просто показываем новое слово
    setNextWord(word);
    addToHistory(word);
  };

  const getRandomWord = async () => {
    // берем рандомное слово и инфу о том, есть ли слова на обучение вообще
    const {randomWord: word, learningWordsLength} =
      (await getRandomLearningWord()) as {
        randomWord: Word;
        learningWordsLength: number;
      };

    // чтобы не спрашивало 2 раза подряд одно и то же
    if (history.length && learningWordsLength > 1) {
      if (history[history.length - 1].nextWord.id === word.id) {
        getRandomWord();
        return;
      }
    }

    if (learningWordsLength === 0) {
      handleNoLearningWords();
      return;
    }

    if (learningWordsLength <= 10) {
      await handleNewWordsToLearn(word);
      return;
    }

    await handleNextWord(word);
  };

  const handleSend = async () => {
    try {
      if (!nextWord) return;

      const isCorrect = nextWord.translation.find(
        value => inputText.trim().toLowerCase() === value.toLowerCase(),
      );

      const newCorrectCount = nextWord.correctCount + (isCorrect ? 1 : 0);
      const note = isCorrect
        ? await handleCorrectAnswer(nextWord, newCorrectCount)
        : handleIncorrectAnswer(nextWord);

      updateHistory(note, inputText);

      await getRandomWord();
      setInputText(''); // Очистить поле ввода
    } catch (err) {
      console.log(err);
    }
  };

  const handleCorrectAnswer = async (word: Word, newCorrectCount: number) => {
    await updateCorrectCount(word.id, newCorrectCount);

    let note = `Верно, ${word.armenian.toLowerCase()}[${
      word.transcription
    }] можно перевести как '${word.translation
      .join(', ')
      .toLowerCase()}'. Теперь у этого слова ${newCorrectCount} правильных ответов из ${correctAnswersGoal}.`;

    if (newCorrectCount >= correctAnswersGoal) {
      note += ` Слово переносится в список выученных слов.`;
      await addLearnedWord(word);
      await deleteLearningWord(word.id);
    }

    return note;
  };

  const handleIncorrectAnswer = (word: Word) => {
    return `Не совсем. ${word.armenian} [${
      word.transcription
    }] можно перевести как '${word.translation
      .join(', ')
      .toLowerCase()}'. У этого слова все еще ${
      word.correctCount
    } правильных ответов из ${correctAnswersGoal}.`;
  };

  const updateHistory = (note: string, input: string) => {
    setHistory((prevHistory: any) => {
      const updatedHistory = [...prevHistory];
      const lastItem = updatedHistory[updatedHistory.length - 1];

      if (lastItem) {
        updatedHistory[updatedHistory.length - 1] = {
          ...lastItem,
          note,
          input, // Обновляем свойства
        };
      }

      return updatedHistory.slice(-20);
    });
  };

  const scrollToEnd = (delay: number) => {
    setTimeout(() => {
      // @ts-ignore
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, delay);
  };

  if (showInfoMenu === null) return <Text>f</Text>;

  return (
    <>
      {loading && <Loader />}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.title}>Обучение</Text>
        <TouchableOpacity
          style={styles.openButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="question-mark" size={22} color="white" />
        </TouchableOpacity>
      </View>
      <Alphabet modalVisible={modalVisible} setModalVisible={setModalVisible} />
      {showInfoMenu ? (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.description}>
            {words.length
              ? `Вот ${words.length} новых слов на изучение:`
              : 'Вы все выучили! Возьмите с полки вкусный пирожок :)'}
          </Text>
          <WordList words={words} />
        </ScrollView>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          {history.map((item: any, index: number) => (
            <View key={index}>
              <DelayedBubble delay={300}>
                <Bubble scrollToEnd={scrollToEnd}>
                  <>
                    Следующее слово: {item.nextWord?.armenian} [
                    {item.nextWord?.transcription}] — как переводится?
                  </>
                </Bubble>
              </DelayedBubble>

              {item.input && (
                <Bubble isHighlighted align="right" scrollToEnd={scrollToEnd}>
                  {item.input}
                </Bubble>
              )}

              {item.note && (
                <DelayedBubble delay={300}>
                  <Bubble scrollToEnd={scrollToEnd}>{item.note}</Bubble>
                </DelayedBubble>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {!showInfoMenu && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Введите слово"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!words.length || !inputText) && styles.sendButtonDisabled,
            ]}
            disabled={!words.length || !inputText}
            onPress={handleSend}>
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {showInfoMenu && !!words.length && (
        <View style={styles.container}>
          <NextButton
            onPress={() => {
              setShowInfoMenu(false);
              getRandomWord();
            }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  description: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    marginBottom: 20,
  },
  word: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#3f51b5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    marginLeft: 10,
    backgroundColor: '#3f51b5',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
});
