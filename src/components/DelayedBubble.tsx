import React, {useState, useEffect, ReactElement} from 'react';
import {View} from 'react-native';

export const DelayedBubble = ({
  delay,
  children,
}: {
  delay: number;
  children: ReactElement;
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  if (!show) return null;

  return <View>{children}</View>;
};
