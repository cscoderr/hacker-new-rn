import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const ItemShimmer = () => {
  const shimmerColors = ["#e0e0e0", "#f5f5f5", "#e0e0e0"];

  return (
    <View style={styles.container}>
      {/* Top Row - Username & Bookmark */}
      <View style={styles.row}>
        <ShimmerPlaceholder
          shimmerColors={shimmerColors}
          LinearGradient={LinearGradient}
          style={styles.textShimmer}
        />
        <ShimmerPlaceholder
          shimmerColors={shimmerColors}
          LinearGradient={LinearGradient}
          style={styles.iconShimmer}
        />
      </View>

      {/* Title Shimmer */}
      <ShimmerPlaceholder
        shimmerColors={shimmerColors}
        LinearGradient={LinearGradient}
        style={styles.titleShimmer}
      />

      {/* Bottom Row - Score & Comments */}
      <View style={styles.row}>
        <View style={styles.iconTextRow}>
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            LinearGradient={LinearGradient}
            style={styles.textShimmer}
          />
          <ShimmerPlaceholder
            shimmerColors={shimmerColors}
            LinearGradient={LinearGradient}
            style={styles.textShimmer}
          />
        </View>
        <ShimmerPlaceholder
          shimmerColors={shimmerColors}
          LinearGradient={LinearGradient}
          style={styles.textShimmer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    marginStart: 10,
    marginVertical: 10,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  textShimmer: {
    width: "20%",
    height: 15,
    borderRadius: 8,
  },
  iconTextRow: {
    flexDirection: "row",
    gap: 10,
  },
  iconShimmer: {
    height: 15,
    width: 15,
    borderRadius: 8,
  },
  titleShimmer: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    marginBottom: 5,
  },
});
export default ItemShimmer;
