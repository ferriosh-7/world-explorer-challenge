import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import { colors } from '../theme';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.3;

interface SwipeNavigatorProps {
  children: React.ReactNode[];
  initialIndex?: number;
  onIndexChange?: (index: number) => void;
  style?: any;
  enableSwipe?: boolean;
}

const SwipeNavigator: React.FC<SwipeNavigatorProps> = ({
  children,
  initialIndex = 0,
  onIndexChange,
  style,
  enableSwipe = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const translateX = useRef(new Animated.Value(-initialIndex * screenWidth)).current;
  const lastOffset = useRef(-initialIndex * screenWidth);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!enableSwipe) return false;
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      
      onPanResponderGrant: () => {
        translateX.setOffset(lastOffset.current);
        translateX.setValue(0);
      },
      
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        translateX.flattenOffset();
        
        const { dx, vx } = gestureState;
        const shouldGoNext = dx < -SWIPE_THRESHOLD || vx < -0.5;
        const shouldGoPrev = dx > SWIPE_THRESHOLD || vx > 0.5;
        
        let newIndex = currentIndex;
        
        if (shouldGoNext && currentIndex < children.length - 1) {
          newIndex = currentIndex + 1;
        } else if (shouldGoPrev && currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        
        animateToIndex(newIndex);
      },
    })
  ).current;

  const animateToIndex = useCallback((index: number) => {
    const toValue = -index * screenWidth;
    
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
    
    lastOffset.current = toValue;
    
    if (index !== currentIndex) {
      setCurrentIndex(index);
      onIndexChange?.(index);
    }
  }, [currentIndex, onIndexChange, translateX]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < children.length) {
      animateToIndex(index);
    }
  }, [animateToIndex, children.length]);

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            width: screenWidth * children.length,
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children.map((child, index) => (
          <View key={index} style={styles.page}>
            {child}
          </View>
        ))}
      </Animated.View>
      
      {/* Page indicators */}
      {children.length > 1 && (
        <View style={styles.indicators}>
          {children.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    width: screenWidth,
    flex: 1,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    width: 24,
  },
});

export default SwipeNavigator;
