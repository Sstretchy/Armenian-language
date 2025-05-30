import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';

export const NextButton = ({onPress}: any) => {
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    // Разблокировать кнопку через 2 секунды после рендера
    const timer = setTimeout(() => setDisabled(false), 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.startButtonText}>Понятно</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: 200,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
