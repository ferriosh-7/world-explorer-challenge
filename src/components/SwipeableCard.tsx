import React, { useRef } from 'react';
import { View, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import Card from './Card';
import { colors, spacing } from '../theme';

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = screenWidth * 0.25;

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  style?: any;
  disabled?: boolean;
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction,
  rightAction,
  style,
  disabled = false,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (disabled) return false;
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      
      onPanResponderGrant: () => {
        translateX.setOffset(lastOffset.current);
        translateX.setValue(0);
      },
      
      onPanResponderMove: (evt, gestureState) => {
        // Limit the swipe distance
        const maxSwipe = screenWidth * 0.7;
        const clampedDx = Math.max(-maxSwipe, Math.min(maxSwipe, gestureState.dx));
        translateX.setValue(clampedDx);
      },
      
      onPanResponderRelease: (evt, gestureState) => {
        translateX.flattenOffset();
        
        const { dx, vx } = gestureState;
        const shouldSwipeLeft = dx < -SWIPE_THRESHOLD || vx < -0.5;
        const shouldSwipeRight = dx > SWIPE_THRESHOLD || vx > 0.5;
        
        if (shouldSwipeLeft && onSwipeLeft) {
          // Animate out to the left
          Animated.timing(translateX, {
            toValue: -screenWidth,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onSwipeLeft();
            resetPosition();
          });
        } else if (shouldSwipeRight && onSwipeRight) {
          // Animate out to the right
          Animated.timing(translateX, {
            toValue: screenWidth,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onSwipeRight();
            resetPosition();
          });
        } else {
          // Snap back to center
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    lastOffset.current = 0;
  };

  const leftActionOpacity = translateX.interpolate({
    inputRange: [-screenWidth, -SWIPE_THRESHOLD, 0],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

  const rightActionOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD, screenWidth],
    outputRange: [0, 1, 1],
    extrapolate: 'clamp',
  });

  const cardScale = translateX.interpolate({
    inputRange: [-screenWidth * 0.5, 0, screenWidth * 0.5],
    outputRange: [0.95, 1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]}>
      {/* Left action background */}
      {leftAction && (
        <Animated.View style={[styles.actionContainer, styles.leftAction, { opacity: leftActionOpacity }]}>
          {leftAction}
        </Animated.View>
      )}
      
      {/* Right action background */}
      {rightAction && (
        <Animated.View style={[styles.actionContainer, styles.rightAction, { opacity: rightActionOpacity }]}>
          {rightAction}
        </Animated.View>
      )}
      
      {/* Main card */}
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX },
              { scale: cardScale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Card style={styles.card}>
          {children}
        </Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  cardContainer: {
    zIndex: 1,
  },
  card: {
    margin: 0,
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
    borderRadius: spacing.md,
  },
  leftAction: {
    backgroundColor: colors.error,
    alignItems: 'flex-end',
    paddingRight: spacing.xl,
  },
  rightAction: {
    backgroundColor: colors.success,
    alignItems: 'flex-start',
    paddingLeft: spacing.xl,
  },
});

export default SwipeableCard;
