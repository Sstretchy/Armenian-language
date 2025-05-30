import {Word} from '../types/TWord';
import {getRealmInstance, realmConfig} from './initializeRealm';

export const addLearnedWord = async (word: {
  id: number;
  armenian: string;
  transcription: string;
  translation: string[];
  correctCount: number;
}): Promise<void> => {
  const realm = await getRealmInstance();

  try {
    realm.write(() => {
      realm.create('LearnedWord', word);
    });
    console.log(
      `Слово "${word.translation.join(', ')}" добавлено в список выученных.`,
    );
  } catch (error) {
    console.error('Ошибка добавления слова в выученные:', error);
  }
};

export const getLearnedWords = async (): Promise<Word[]> => {
  const realm = await getRealmInstance();

  try {
     const learnedWords = realm.objects('LearnedWord').map(word => ({
      id: word.id,
      armenian: word.armenian,
      transcription: word.transcription,
      // @ts-ignore
      translation: [...word.translation],
      correctCount: word.correctCount,
    })) as Word[];

    console.log('Выученные слова:', learnedWords);
    return learnedWords;
  } catch (error) {
    console.error('Ошибка получения выученных слов:', error);
    return [];
  }
};

export const clearLearnedWords = async (): Promise<void> => {
  const realm = await getRealmInstance();

  try {
    realm.write(() => {
      realm.delete(realm.objects('LearnedWord'));
    });
    console.log('Список выученных слов очищен.');
  } catch (error) {
    console.error('Ошибка очистки выученных слов:', error);
  }
};

export const moveLearnedWordToLearning = async (wordId: number) => {
  try {
    const realm = await getRealmInstance();

    let wordData = {} as Word;

    realm.write(() => {
      const word = realm.objectForPrimaryKey('LearnedWord', wordId) as Word;

      if (!word) {
        console.log(`Слово с id ${wordId} не найдено в LearnedWord`);
        return;
      }

      wordData = {
        id: word.id,
        armenian: word.armenian,
        transcription: word.transcription,
        translation: [...word.translation],
        correctCount: 0,
      };

      realm.delete(word);
    });

    if (wordData) {
      realm.write(() => {
        realm.create('LearningWord', wordData);
      });

      console.log(`Слово "${wordData.armenian}" возвращено в LearningWord`);
    }
  } catch (error) {
    console.error('Ошибка при возврате слова в LearningWord:', error);
  }
};
