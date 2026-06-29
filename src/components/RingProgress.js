import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS, FONTS } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function RingProgress({
  size = 120,
  strokeWidth = 10,
  progress = 0.7,
  color = COLORS.accent,
  label,
  value,
  subtitle,
}) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: progress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id={`grad-${color}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor={color} stopOpacity="1" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.5" />
            </LinearGradient>
          </Defs>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.cardLight}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={{ alignItems: 'center' }}>
          {value !== undefined && (
            <Text style={{
              color: COLORS.text,
              fontSize: FONTS.sizes.xl,
              fontWeight: FONTS.weights.black,
              lineHeight: 28,
            }}>{value}</Text>
          )}
          {subtitle && (
            <Text style={{
              color: COLORS.textMuted,
              fontSize: FONTS.sizes.xs,
              fontWeight: FONTS.weights.medium,
              textAlign: 'center',
            }}>{subtitle}</Text>
          )}
        </View>
      </View>
      {label && (
        <Text style={{
          color: COLORS.textMuted,
          fontSize: FONTS.sizes.sm,
          marginTop: 6,
          textAlign: 'center',
        }}>{label}</Text>
      )}
    </View>
  );
}
