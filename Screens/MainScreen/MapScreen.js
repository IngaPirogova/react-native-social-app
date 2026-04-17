import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";

const MapScreen = ({ route }) => {
  const location = route.params?.location;

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Нет координат</Text>
      </View>
    );
  }

  const latitude =
    typeof location === "string"
      ? Number(location.split(",")[0])
      : location.latitude;

  const longitude =
    typeof location === "string"
      ? Number(location.split(",")[1])
      : location.longitude;

  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <Text>Карта доступна только на мобильном 📱</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Фото"
        />
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});