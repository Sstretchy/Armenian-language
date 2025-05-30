import AsyncStorage from '@react-native-async-storage/async-storage';

const CORRECT_ANSWERS_COAL = 'correctAnswersGoal';

export const saveCorrectAnswersGoal = async value => {
  try {
    await AsyncStorage.setItem(CORRECT_ANSWERS_COAL, value.toString() || '10');
    console.log('Сохранено значение:', value);
  } catch (e) {
    console.error('Ошибка при сохранении:', e);
  }
};

export const loadCorrectAnswersGoal = async () => {
  try {
    const value = await AsyncStorage.getItem(CORRECT_ANSWERS_COAL);
    return value ? parseInt(value, 10) : 10;
  } catch (e) {
    console.error('Ошибка при загрузке:', e);
    return 10; // Возвращаем значение по умолчанию в случае ошибки
  }
};
