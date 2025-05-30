import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';

export const StartButton = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.startButton}
        // @ts-ignore
        onPress={() => navigation.navigate('Learning')}>
        <Text style={styles.startButtonText}>Учить слова</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  startButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    width: 200,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
