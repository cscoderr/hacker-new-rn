import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { News } from "@/types/new";
import RenderHTML from "react-native-render-html";
import { ScrollView } from "moti";

const fetchNewsWithID = async (id: number): Promise<News> => {
  try {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/43148408.json?print=pretty`
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

const DetailsScreen = () => {
  const { top } = useSafeAreaInsets();
  const theme = useColorScheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = React.useState(true);
  const [news, setNews] = React.useState<News>();
  const [comments, setComments] = React.useState<News[] | undefined>([]);
  const { width } = useWindowDimensions();
  const handleNewsDetails = React.useCallback(async () => {
    setLoading(true);
    const response = await fetchNewsWithID(Number(id));
    console.log(response);

    setNews(response);
    const comments = response.kids?.map(
      async (kid) => await fetchNewsWithID(kid)
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    handleNewsDetails();
  }, [handleNewsDetails]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable onPress={() => router.back()}>
        <BlurView>
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors[theme ?? "light"].tint}
          />
        </BlurView>
      </Pressable>
      <Text style={{ color: "white" }}>DetailsScreen</Text>
      {loading && <ActivityIndicator style={styles.loader} />}
      {!loading && (
        <ScrollView>
          <Text>{news?.title}</Text>
          {/* <RenderHTML
            contentWidth={width}
            source={{ html: news!.text!.toString() }}
            enableExperimentalMarginCollapsing={true}
          /> */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
});

export default DetailsScreen;
