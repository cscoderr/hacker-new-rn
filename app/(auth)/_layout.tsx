import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="signin" options={{ presentation: "modal" }} />
      <Stack.Screen name="signup" />
    </Stack>
  );
};

export default AuthLayout;
