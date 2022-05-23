import React from "react";
import { StyleSheet, View } from "react-native";

type Size = "small" | "medium" | "large";

type Props = {
  size?: Size;
  style?: object;
  filled?: boolean;
};

export default function PinCircle({ size, style, filled }: Props) {
  const getBigSize = () => {
    if (!size) return 36;
    switch (size) {
      case "small":
        return 16;
      case "medium":
        return 24;
      case "large":
        return 36;
    }
  };

  const getSmallSize = () => {
    if (!size) return 16;
    switch (size) {
      case "small":
        return 8;
      case "medium":
        return 12;
      case "large":
        return 16;
    }
  };
  return (
    <View style={style}>
      <View style={[styles.circle, { height: getBigSize() }]}>
        {filled && (
          <View style={[styles.innerCircle, { height: getSmallSize() }]}></View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    height: 36,
    aspectRatio: 1 / 1,
    backgroundColor: "#FFF8F0",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    height: 16,
    aspectRatio: 1 / 1,
    backgroundColor: "#804409",
    borderRadius: 100,
  },
});
