import Realm from 'realm';
import {WordSchema, LearnedWordSchema, LearningWordSchema} from './schemas';
import {initialWords} from '../data/words';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const realmConfig = {
  path: 'WordsDatabase',
  schema: [WordSchema, LearnedWordSchema, LearningWordSchema],
};

let globalRealm: Realm | null = null;

// Функция для перемешивания массива
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Функция для инициализации глобального инстанса Realm
export const getRealmInstance = async (): Promise<Realm> => {
  const isInitialized = await AsyncStorage.getItem('isDatabaseInitialized');

  if (!globalRealm || globalRealm.isClosed) {
    globalRealm = await Realm.open(realmConfig);

    // Проверяем и загружаем начальные данные, если база пуста
    if (globalRealm.objects('Word').length === 0 && !isInitialized) {
      console.log('Загружаем начальные данные...');
      const shuffledWords = shuffleArray([...initialWords]); // Перемешиваем слова
      globalRealm.write(() => {
        shuffledWords.forEach(word => {
          globalRealm?.create('Word', {
            ...word,
            correctCount: 0, // Устанавливаем значение по умолчанию
          });
        });
      });

      await AsyncStorage.setItem('isDatabaseInitialized', 'true');
      console.log('Данные успешно загружены!');
    } else {
      console.log('Данные уже существуют.');
    }
  }
  return globalRealm;
};

// Функция для сброса базы данных
export const resetDatabase = async (): Promise<void> => {
  try {
    const realm = await getRealmInstance();

    realm.write(() => {
      // Удаляем все выученные слова
      const learnedWords = realm.objects('LearnedWord');
      realm.delete(learnedWords);

      // Удаляем все слова для изучения
      const learningWords = realm.objects('LearningWord');
      realm.delete(learningWords);

      // Удаляем все слова из общего списка
      const words = realm.objects('Word');
      realm.delete(words);

      // Загружаем начальные данные
      const shuffledWords = shuffleArray([...initialWords]); // Перемешиваем слова
      shuffledWords.forEach(word => {
        realm.create('Word', {
          ...word,
          correctCount: 0, // Устанавливаем значение по умолчанию
        });
      });
    });

    console.log('База данных сброшена и начальные данные загружены!');
  } catch (err) {
    console.log(err);
  }
};
