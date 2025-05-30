import {Word} from '../types/TWord';
import {getRealmInstance} from './initializeRealm';

export const getLearningWords = async (): Promise<Word[]> => {
  try {
    const realm = await getRealmInstance();

    const words: Word[] = Array.from(realm.objects('LearningWord'));
    const learningWordsArray = Array.from(words).map(word => ({...word})); // Создаем копию данных

    return learningWordsArray; // Возвращаем массив обычных объектов
  } catch (error) {
    console.error('Ошибка получения слов для изучения:', error);
    return [];
  }
};

export const getRandomLearningWord = async () => {
  try {
    const realm = await getRealmInstance();

    // Получаем все слова из таблицы LearningWord
    const learningWords = realm.objects('LearningWord');

    if (learningWords.length === 0) {
      console.log('Нет слов для обучения.');
      return {randomWord: null, learningWordsLength: 0};
    }

    // Генерируем случайный индекс
    const randomIndex = Math.floor(Math.random() * learningWords.length);

    // Копируем данные из выбранного слова
    const randomWord = {
      id: learningWords[randomIndex].id,
      armenian: learningWords[randomIndex].armenian,
      transcription: learningWords[randomIndex].transcription,
      translation: JSON.parse(
        JSON.stringify(learningWords[randomIndex].translation),
      ),
      correctCount: learningWords[randomIndex].correctCount,
    };

    // Возвращаем копию объекта
    return {randomWord, learningWordsLength: learningWords.length};
  } catch (error) {
    console.error('Ошибка при получении случайного слова:', error);
    return null;
  }
};

export const updateCorrectCount = async (
  wordId: number,
  newCount: number,
): Promise<void> => {
  const realm = await getRealmInstance();

  try {
    realm.write(() => {
      const word = realm.objectForPrimaryKey('LearningWord', wordId);
      if (word) {
        word.correctCount = newCount;
        console.log(`CorrectCount обновлен для слова с id ${wordId}`);
      } else {
        console.error(`Слово с id ${wordId} не найдено`);
      }
    });
  } catch (error) {
    console.error('Ошибка обновления correctCount:', error);
  }
};

export const deleteLearningWord = async (wordId: number): Promise<void> => {
  const realm = await getRealmInstance();

  try {
    realm.write(() => {
      const word = realm.objectForPrimaryKey('LearningWord', wordId);
      if (word) {
        realm.delete(word);
        console.log(`Слово с id ${wordId} успешно удалено`);
      } else {
        console.error(`Слово с id ${wordId} не найдено`);
      }
    });
  } catch (error) {
    console.error('Ошибка удаления слова из списка на изучение:', error);
  }
};

export const moveWordsToLearning = async () => {
  try {
    const realm = await getRealmInstance();

    const wordsToMove = realm.objects('Word').slice(0, 20); // Получаем 20 слов из Word

    const wordsToMoveLength = wordsToMove.length;

    realm.write(() => {
      // Перемещаем слова в LearningWord
      wordsToMove.forEach(word => {
        realm.create('LearningWord', {
          id: word.id,
          armenian: word.armenian,
          transcription: word.transcription,
          translation: word.translation,
          correctCount: 0, // Устанавливаем начальное значение correctCount
        });

        // Удаляем слово из Word
        realm.delete(word);
      });
    });

    console.log('Слова успешно перемещены в LearningWord');

    return wordsToMoveLength;
  } catch (error) {
    console.log(error);
  }
};
