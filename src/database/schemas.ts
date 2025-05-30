export const WordSchema: Realm.ObjectSchema = {
  name: 'Word',
  properties: {
    id: 'int', // Поле id — это целое число
    armenian: 'string', // Армянское слово
    transcription: 'string', // Транскрипция
    translation: 'string[]', // Перевод
    correctCount: { type: 'int', default: 0 }, // Счетчик правильных ответов
  },
  primaryKey: 'id', // Укажите primaryKey для уникальности
};

export const LearnedWordSchema: Realm.ObjectSchema = {
  name: 'LearnedWord',
  properties: {
    id: 'int', // Уникальный идентификатор
    armenian: 'string', // Армянское слово
    transcription: 'string', // Транскрипция
    translation: 'string[]', // Перевод
    correctCount: { type: 'int', default: 0 }, // Счетчик правильных ответов
  },
  primaryKey: 'id', // Уникальное поле для поиска
};

export const LearningWordSchema: Realm.ObjectSchema = {
  name: 'LearningWord',
  properties: {
    id: 'int', // Уникальный идентификатор
    armenian: 'string', // Слово на армянском
    transcription: 'string', // Транскрипция
    translation: 'string[]', // Перевод
    correctCount: {type: 'int', default: 0}, // Количество правильных ответов
  },
  primaryKey: 'id',
};
