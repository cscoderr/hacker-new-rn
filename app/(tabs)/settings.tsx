import { View, Text, Button } from "react-native";
import React from "react";
import { Link, router } from "expo-router";

const SettingsScreen = () => {
  return (
    <View>
      <Text>SettingsScreen</Text>
      <Link href={"/signin"}>Login required</Link>
    </View>
  );
};

export default SettingsScreen;
