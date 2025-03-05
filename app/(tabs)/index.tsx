import {
  ActivityIndicator,
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import AnimatedTabView from "@/components/AnimatedTabView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { News } from "@/types/new";
import moment from "moment";
import * as AppleColors from "@bacons/apple-colors";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

enum StoriesType {
  topstories = 0,
  newstories,
  beststories,
  askstories,
  showstories,
}

const fetchStories = async (
  type: StoriesType
): Promise<{ ids: number[]; news: News[] }> => {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/${StoriesType[type]}.json`
    );
    if (!response.ok) {
      console.log("errpor");
      throw new Error("unable to get news");
    }
    const newsId = (await response.json()) as number[];
    const ids = newsId.slice(0, 30);

    const newsResponse = await Promise.all(ids.map(fetchNewsWithID));
    return { ids: newsId, news: newsResponse };
  } catch (e) {
    console.log(e);
    throw new Error("unable to get news");
  }
};

type fetchMoreStoriesProp = {
  cursor: number;
  limit: number;
  ids: number[];
};
const fetchMoreStories = async ({
  cursor,
  limit,
  ids,
}: fetchMoreStoriesProp): Promise<News[]> => {
  try {
    const newsId = ids.slice(cursor, cursor + limit);
    if (newsId.length === 0) return [];
    return await Promise.all(newsId.map((id) => fetchNewsWithID(id)));
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
  const [selectedTab, setSelectedTab] = React.useState(StoriesType.topstories);
  const { top, bottom } = useSafeAreaInsets();
  const idsRef = React.useRef<number[]>([]);
  const [refreshing, setRefreshing] = React.useState(true);
  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [selectedTab],
    queryFn: async ({ pageParam }) => {
      if (pageParam == 0) {
        const repsonse = await fetchStories(selectedTab);
        idsRef.current = repsonse.ids;
        return repsonse.news;
      }
      if (idsRef.current.length === 0) return [];
      return fetchMoreStories({
        cursor: pageParam,
        ids: idsRef.current,
        limit: 30,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages, lastPageParams) => {
      const totalLoaded = pages.flat().length;
      return totalLoaded < idsRef.current.length ? totalLoaded : undefined;
    },
  });

  const renderItem = React.useCallback(
    ({ item, index }: { item: News; index: number }) => (
      <Item item={item} index={index} />
    ),
    []
  );
  const handleLoadMore = React.useCallback(
    () => fetchNextPage(),
    [fetchNextPage]
  );

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // fetchTopStoriesData();
  }, []);
  return (
    <View style={styles.container}>
      <AnimatedTabView
        selectedIndex={selectedTab}
        tabs={["Top", "New", "Best", "Ask", "Show"]}
        onTabSelected={(index) => setSelectedTab(index)}
      />
      {status === "pending" && (
        <ActivityIndicator style={[styles.loader, { marginTop: top }]} />
      )}
      {status === "error" && <Text>An error occur</Text>}

      {status === "success" && (
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={data?.pages.flatMap((res) => res)}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => <ItemSeparator />}
          contentContainerStyle={{
            marginHorizontal: 15,
            paddingTop: top + (Platform.OS === "ios" ? 0 : 32),
            paddingBottom: Platform.OS === "android" ? bottom + 36 : 0,
            gap: 10,
          }}
          removeClippedSubviews={true}
          initialNumToRender={5}
          maxToRenderPerBatch={8}
          windowSize={5}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? <ActivityIndicator /> : null
          }
          getItemLayout={(data, index) => ({
            length: 100,
            offset: 100 * index,
            index,
          })}
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

const Item = React.memo(
  ({ item, index }: { item: News; index: number }) => {
    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? "light"].text;
    const tintColor = Colors[colorScheme ?? "light"].tint;

    return (
      <Link href={`/${item.id}`} asChild>
        <TouchableOpacity activeOpacity={0.5} style={styles.itemContainer}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.author}>@{item.by}</Text>
            <Ionicons name="bookmark-outline" color={tintColor} size={16} />
          </View>
          {/* Content */}
          <Text style={styles.title}>
            {index + 1} - {item.title}
          </Text>
          {/* Footer Section */}
          <View style={styles.footer}>
            <View style={styles.leftSection}>
              <View style={styles.iconText}>
                <Ionicons name="arrow-up" color={"green"} />
                <Text>{item.score}</Text>
              </View>
              <View style={styles.iconText}>
                <Ionicons name="chatbox-outline" color={textColor} />
                <Text>{item.descendants}</Text>
              </View>
            </View>
            <View style={styles.iconText}>
              <Ionicons name="time-outline" color={textColor} />
              <Text>{moment.unix(item.time).fromNow()}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  },
  (prevProps, nextProps) => prevProps.item.id === nextProps.item.id
);

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
    marginHorizontal: -5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: -StyleSheet.hairlineWidth,
    borderBottomColor: AppleColors.separator,
  },
  itemContainer: {
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  author: {
    fontSize: 14,
    color: "tomato",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  leftSection: {
    flexDirection: "row",
    gap: 10,
  },
  iconText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
});
