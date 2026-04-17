import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Provider, useDispatch } from "react-redux";
import { store } from "./redux/store";
import Main from "./components/Main";
import { authStateCahngeUser } from "./redux/auth/authOperations";

import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

const Bootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authStateCahngeUser());
  }, []);

  return <Main />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  

  return (
    <>
    <Provider store={store}>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <Bootstrap />
      </View>
    </Provider>
      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});