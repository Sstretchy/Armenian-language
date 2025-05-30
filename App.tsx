import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Welcome} from './src/containers/Welcome';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {Header} from './src/containers/Header';
import {Settings} from './src/containers/Settings';
import {WordsToLearn} from './src/containers/WordsToLearn';
import {LearnedWords} from './src/containers/LearnedWords';
import {Learning} from './src/containers/Learning';
import {getRealmInstance, resetDatabase} from './src/database/initializeRealm';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

export const navigationRef = createNavigationContainerRef();

const App = () => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const realm = await getRealmInstance();
        console.log('Realm инициализирован:', realm);
      } catch (error) {
        console.error('Ошибка инициализации Realm:', error);
      }
    };

    setupDatabase();
  }, []);

  const handleResetProgress = () => {
    Alert.alert(
      'Сброс прогресса',
      'Вы уверены, что хотите сбросить весь прогресс?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Сбросить',
          onPress: async () => {
            await resetDatabase();
            if (navigationRef.isReady()) {
              // @ts-ignore
              navigationRef.navigate('Home');
              setKey(prevKey => prevKey + 1);
            }
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <NavigationContainer ref={navigationRef}>
        <SafeAreaView style={styles.container}>
          {/* Отдельный кастомный хедер */}
          <View style={styles.headerContainer}>
            <Header />
            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleResetProgress}>
              <Icon name="restart-alt" size={30} color="#fff" />
            </TouchableOpacity>
          </View>

          <Tab.Navigator
            screenOptions={{
              tabBarStyle: {display: 'none'},
            }}>
            <Tab.Screen name="Home" component={Welcome} />
            <Tab.Screen name="Settings" component={Settings} />
            <Tab.Screen name="LearnedWords" component={LearnedWords} />
            <Tab.Screen name="WordsToLearn" component={WordsToLearn} />
            <Tab.Screen
              name="Learning"
              children={useCallback(
                () => (
                  <Learning key={key} />
                ),
                [key],
              )} // мне нужно это для конкретного случая (сброса всех данных, чтобы вызвать ререндер)
            />
          </Tab.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  resetButton: {
    backgroundColor: '#dc3545',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#222',
  },
  button: {
    padding: 10,
    borderRadius: 8,
  },
});

export default App;
