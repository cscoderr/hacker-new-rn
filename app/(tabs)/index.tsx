import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import AnimatedTabView from "@/components/AnimatedTabView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { News } from "@/types/new";
import moment from "moment";
import * as AppleColors from "@bacons/apple-colors";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";

const fetchNews = async (): Promise<News[]> => {
  try {
    const response = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json"
    );
    if (!response.ok) {
      console.log("errpor");
      throw new Error("unable to get news");
    }
    const newsId = (await response.json()) as number[];
    const ids = newsId.splice(0, 10);
    let newsResponse: News[] = [];

    for (const index in ids) {
      const id = ids[index];
      const news = await fetchNewsWithID(id);
      newsResponse.push(news);
    }
    return newsResponse;
  } catch (e) {
    console.log(e);
    throw new Error("unable to get news");
  }
};

const fetchNewsWithID = async (id: number): Promise<News> => {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`
    );
    if (!response.ok) {
      console.log("errpor");
      throw new Error("unable to get news");
    }
    return (await response.json()) as News;
  } catch (e) {
    console.log(e);
    throw new Error("unable to get news");
  }
};

export default function TabOneScreen() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { top } = useSafeAreaInsets();
  const [news, setNews] = React.useState<News[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(true);
  const theme = useColorScheme();

  const fetchNewsData = React.useCallback(async () => {
    try {
      const data = await fetchNews();
      setNews(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchNewsData();
  }, [fetchNewsData]);

  React.useEffect(() => {
    setLoading(true);
    fetchNewsData();
  }, [fetchNewsData]);
  return (
    <View style={styles.container}>
      <AnimatedTabView
        selectedIndex={selectedTab}
        tabs={["Top", "New", "Best", "Ask", "Show"]}
        onTabSelected={(index) => setSelectedTab(index)}
      />
      {/* <View style={{ flex: 1, paddingTop: top + 60 }}> */}
      {loading && (
        <ActivityIndicator style={[styles.loader, { marginTop: top }]} />
      )}

      {!loading && (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={news}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <ItemSeparator />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginHorizontal: 15,
            paddingTop: top + 16,
            gap: 10,
          }}
          style={{ paddingVertical: 10, flex: 1 }}
          refreshControl={
            <RefreshControl onRefresh={handleRefresh} refreshing={refreshing} />
          }
        />
      )}
    </View>
    // </View>
  );
}

const ItemSeparator = () => (
  <View>
    <View style={{ height: 10 }} />
    <View style={styles.separator} />
  </View>
);

const Item = ({ item }: { item: News }) => {
  const colorScheme = useColorScheme();

  return (
    <Link href={`/${item.id}`} asChild>
      <TouchableOpacity activeOpacity={0.5}>
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
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 14 }}>@{item.by}</Text>
            <Ionicons
              name="bookmark"
              color={Colors[colorScheme ?? "light"].tint}
              size={16}
            />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", gap: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Ionicons name="arrow-up" color={"green"} />
                <Text>{item.score}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Ionicons
                  name="chatbox-outline"
                  color={Colors[colorScheme ?? "light"].text}
                />
                <Text>{item.descendants}</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Ionicons
                name="time-outline"
                color={Colors[colorScheme ?? "light"].text}
              />
              <Text>{moment.unix(item.time).parseZone().fromNow()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  separator: {
    marginHorizontal: -15,
    marginStart: 60,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: -StyleSheet.hairlineWidth,
    borderBottomColor: AppleColors.separator,
  },
});
