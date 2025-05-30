import React, {ReactElement, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';

export const Bubble = ({
  align = 'left',
  isHighlighted = false,
  children,
  scrollToEnd,
}: {
  children: ReactElement | string;
  align?: 'left' | 'right';
  isHighlighted?: boolean;
  scrollToEnd?: (delay: number) => void;
}) => {
  const translateX = useRef(
    new Animated.Value(align === 'left' ? -300 : 300),
  ).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0, // Двигаем бабл в конечное положение
      duration: 500, // Длительность анимации
      useNativeDriver: true, // Для повышения производительности
    }).start();
    if (scrollToEnd) scrollToEnd(0);
  }, [translateX]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {transform: [{translateX}]},
        align === 'right' && styles.alignRight,
        isHighlighted && styles.highlightedBubble,
      ]}>
      <Text style={[styles.text, isHighlighted && styles.highlightedText]}>
        {children}
      </Text>
      <View
        style={[
          styles.tail,
          align === 'right' ? styles.tailRight : styles.tailLeft,
          isHighlighted && styles.highlightedTail,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    backgroundColor: '#c5cae9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  alignRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#283593',
  },
  highlightedBubble: {
    backgroundColor: '#283593',
  },
  text: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    flexWrap: 'wrap'
  },
  highlightedText: {
    color: 'white',
  },
  tail: {
    position: 'absolute',
    bottom: -6,
    width: 16,
    height: 16,
    backgroundColor: '#c5cae9',
    transform: [{rotate: '45deg'}],
  },
  highlightedTail: {
    backgroundColor: '#283593',
  },
  tailRight: {
    right: 16,
  },
  tailLeft: {
    left: 16,
  },
});
