import {
  View,
  Pressable,
  ViewStyle,
  useColorScheme,
  StyleProp,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  Easing,
  StyleProps,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AnimatedTabViewProps {
  selectedIndex: number;
  tabs: string[];
  onTabSelected: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

const AnimatedTabView = ({
  selectedIndex = 0,
  tabs,
  onTabSelected,
  style,
}: AnimatedTabViewProps) => {
  const { top } = useSafeAreaInsets();
  const theme = useColorScheme();
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "transparent",
        zIndex: 1000,
      }}
    >
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        tint={
          theme === "light"
            ? "systemChromeMaterial"
            : "systemChromeMaterialDark"
        }
        style={{
          borderBottomStartRadius: 20,
          borderBottomEndRadius: 20,
          borderCurve: "continuous",
          overflow: "hidden",
          paddingHorizontal: 16,
          paddingTop: top + 16,
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 15,
          }}
        >
          {tabs.map((value, index) => {
            const selected = selectedIndex === index;
            const background = useSharedValue(
              selected ? "tomato" : "transparent"
            );
            const textColor = useSharedValue(selected ? "#FFFFFF" : "#000000");
            const opacity = useSharedValue(1);
            const pressed = useSharedValue(false);
            const padding = useSharedValue(selected ? 20 : 0);

            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: withSpring(pressed.value ? 0.9 : 1) }],
                backgroundColor: withTiming(background.value, {
                  duration: 200,
                  easing: Easing.inOut(Easing.ease),
                }),
                opacity: withTiming(opacity.value, {
                  duration: 150,
                  easing: Easing.inOut(Easing.ease),
                }),
                paddingHorizontal: withTiming(padding.value, {
                  easing: Easing.inOut(Easing.ease),
                }),
              };
            });

            const animatedTextStyle = useAnimatedStyle(() => {
              return {
                color: withTiming(textColor.value, {
                  duration: 200,
                  easing: Easing.inOut(Easing.quad),
                }),
                fontSize: 16,
                fontWeight: selected ? "800" : "600",
              };
            });

            React.useEffect(() => {
              background.value = selected ? "tomato" : "transparent";
              textColor.value = selected
                ? "#FFFFFF"
                : theme === "light"
                ? "#000000"
                : "grey";
              padding.value = selected ? 20 : 0;
            }, [selected]);

            return (
              <Pressable
                key={index}
                onPressIn={() => {
                  opacity.value = 0.6;
                  pressed.value = true;
                }}
                onPressOut={() => {
                  opacity.value = 1;
                  pressed.value = false;
                }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onTabSelected(index);
                }}
              >
                <Animated.View
                  style={[
                    {
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 20,
                      paddingVertical: 6,
                    },
                    animatedStyle,
                  ]}
                >
                  <Animated.Text style={animatedTextStyle}>
                    {value}
                  </Animated.Text>
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

export default AnimatedTabView;
