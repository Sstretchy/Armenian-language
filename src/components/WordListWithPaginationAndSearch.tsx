import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Word} from '../types/TWord';
import {getLearnedWords} from '../database/learnedWords';
import {StartButton} from './StartButton';
import Loader from './Loader';
import {useFocusEffect} from '@react-navigation/native';
import {RenderLearnedWord} from './RenderLearnedWord';

export const WordListWithPaginationAndSearch = () => {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 20; // Количество слов на странице

  useFocusEffect(
    useCallback(() => {
      const fetchWords = async () => {
        try {
          setLoading(true);
          const learnedWords = await getLearnedWords();
          setWords(learnedWords);
          setFilteredWords(learnedWords);
        } finally {
          setLoading(false);
        }
      };

      fetchWords();
    }, []),
  );

  // Обработчик поиска
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWords(words); // Если строка пустая, сбрасываем фильтр
    } else {
      const query = searchQuery.toLowerCase();
      const results = words.filter(
        word =>
          word.armenian.toLowerCase().includes(query) ||
          word.translation.join(', ').toLowerCase().includes(query) ||
          word.transcription.toLowerCase().includes(query),
      );
      setFilteredWords(results);
      setCurrentPage(1); // Сбрасываем на первую страницу
    }
  }, [searchQuery, words]);

  // Получаем данные для текущей страницы
  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredWords.slice(start, end);
  }, [filteredWords, currentPage]);

  // Рассчитываем общее количество страниц
  const totalPages = Math.ceil(filteredWords.length / PAGE_SIZE);

  const renderItem = ({item}: {item: Word}) => (
    <RenderLearnedWord item={item} setWords={setWords}/>
  );

  // Рендер кнопок пагинации
  const renderPagination = () => {
    const pageNumbers = Array.from({length: totalPages}, (_, i) => i + 1);

    return (
      <View style={styles.paginationContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pageNumbers.map(page => (
            <TouchableOpacity
              key={page}
              style={[
                styles.pageButton,
                page === currentPage && styles.activePageButton,
              ]}
              onPress={() => setCurrentPage(page)}>
              <Text
                style={[
                  styles.pageButtonText,
                  page === currentPage && styles.activePageButtonText,
                ]}>
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (loading) return <Loader />;

  return (
    <>
      <Text style={styles.title}>
        Список выученных слов {!!words.length && `(${words.length})`}
      </Text>
      {words.length ? (
        <View style={styles.container}>
          {/* Поле для поиска */}
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск слов"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Список с постраничной навигацией */}
          <FlatList
            data={paginatedWords}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />

          {/* Фиксированная пагинация */}
          {renderPagination()}
        </View>
      ) : (
        <View style={styles.emptyMessageContainer}>
          <Text style={styles.noMessage}>
            Пока что нет изученных слов в списке.
          </Text>
          <StartButton />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: 'white',
  },
  listContainer: {
    paddingBottom: 80,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activePageButton: {
    backgroundColor: '#3f51b5',
  },
  pageButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activePageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyMessageContainer: {flex: 1},
  noMessage: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
