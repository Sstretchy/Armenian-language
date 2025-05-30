import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useNavigationState} from '@react-navigation/native';

export const Header = () => {
  const navigation = useNavigation();
  const activeIndex = useNavigationState(state => state?.index ?? 0);

  const tabs = [
    {name: 'Home', icon: 'home'},
    {name: 'Settings', icon: 'settings'},
    {name: 'LearnedWords', icon: 'playlist-add-check'},
    {name: 'WordsToLearn', icon: 'playlist-add'},
    {name: 'Learning', icon: 'school'},
  ];

  return (
    <>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab.name}
          style={[styles.button, activeIndex === index && styles.activeButton]} // Проверяем активную страницу
          // @ts-ignore
          onPress={() => navigation.navigate(tab.name)}>
          <Icon name={tab.icon} size={30} color="white" />
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#3f51b5',
    borderRadius: 8,
  },
});
