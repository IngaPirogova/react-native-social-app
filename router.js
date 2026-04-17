import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RegistrationScreen from "./Screens/Auth/RegistrationScreen";
import LoginScreen from "./Screens/Auth/LoginScreen";

import Home from "./Screens/MainScreen/Home";
import MapScreen from "./Screens/MainScreen/MapScreen";
import CommentsScreen from "./Screens/MainScreen/CommentsScreen";
import EditPostScreen from "./Screens/MainScreen/EditPostScreen";

// AUTH 
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Registration" component={RegistrationScreen} />
  </AuthStack.Navigator>
);

// MAIN 
const MainNavigator = () => (
  <MainStack.Navigator>
    <MainStack.Screen
      name="Home"
      component={Home}
      options={{ headerShown: false }}
      
    />

    <MainStack.Screen
      name="Map"
      component={MapScreen}
      options={{
        title: "Карта",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Roboto-Medium",
          fontSize: 17,
          lineHeight: 22,
        },
      }}
    />

    <MainStack.Screen
      name="Comments"
      component={CommentsScreen}
      options={{
        title: "Комментарии",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Roboto-Medium",
          fontSize: 17,
          lineHeight: 22,
        },
      }}
    />

    <MainStack.Screen
      name="EditPost"
      component={EditPostScreen}
      options={{
        title: "Редактирование",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Roboto-Medium",
          fontSize: 17,
        },
      }}
    />
  </MainStack.Navigator>
);

// 🔥 ROUTE SWITCH
export const useRoute = (isAuth) => {
  return isAuth ? <MainNavigator /> : <AuthNavigator />;
};