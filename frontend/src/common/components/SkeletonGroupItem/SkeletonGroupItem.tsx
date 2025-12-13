import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet } from 'react-native';

const SkeletonGroupItem = () => {
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: 700,
        loop: true,
      }}
      style={[styles.skeletonBox]}
    />
  );
};

const styles = StyleSheet.create({
  skeletonBox: {
    height: 60,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
});

export { SkeletonGroupItem };
