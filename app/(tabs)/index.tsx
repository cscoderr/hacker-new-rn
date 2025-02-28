import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import React, { useState } from "react";

const DATA = Array.from({ length: 20 }, (_, index) => index + 1);

export default function TabOneScreen() {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <View style={styles.container}>
      <AppTabView
        selectedIndex={selectedTab}
        tabs={["Top", "New", "Best"]}
        onTabSelected={(index) => setSelectedTab(index)}
      />
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        contentContainerStyle={{ marginHorizontal: 15 }}
      />
    </View>
  );
}

const Item = ({ item }: { item: number }) => {
  return (
    <TouchableOpacity activeOpacity={0.5}>
      <View
        style={{
          height: 100,
          backgroundColor: "grey",
          borderTopEndRadius: 10,
          borderTopStartRadius: 10,
        }}
      />
      <View
        style={{
          borderBottomEndRadius: 10,
          borderBottomStartRadius: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>Hello here</Text>
          <Text>Hello here</Text>
        </View>
        <Text style={styles.title}>Hello here {item}</Text>
        <Text style={{ fontSize: 14 }}>@cscoder</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Ionicons name="arrow-up" />
            <Text>10</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Ionicons name="chatbox-outline" />
            <Text>20</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Ionicons name="time-outline" />
            <Text>1 hour ago</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AppTabView = ({
  selectedIndex = 0,
  tabs,
  onTabSelected,
}: {
  selectedIndex: number;
  tabs: string[];
  onTabSelected: (index: number) => void;
}) => {
  return (
    <View style={{ flex: 1, flexDirection: "row", gap: 15, marginBottom: 40 }}>
      {tabs.map((value, index) => {
        const selected = selectedIndex == index;
        return (
          <Pressable
            onPress={() => {
              console.log(index);
              onTabSelected(index);
            }}
            key={index}
            // animate={{
            //   backgroundColor: selected ? "tomato" : "grey",
            //   scale: selected ? 1 : 0.9,
            // }}
            style={{
              height: 40,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: selected ? "tomato" : "grey",
            }}
          >
            <Text style={{ fontSize: 16, color: "#000" }}>{value}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
  },
});
