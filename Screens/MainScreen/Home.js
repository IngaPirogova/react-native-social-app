import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import PostsScreen from "./PostsScreen";
import CreatePostsScreen from "./CreatePostsScreen";
import ProfileScreen from "./ProfileScreen";

const MainTab = createBottomTabNavigator();

const Home = () => {
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerStyle: {
          borderBottomColor: "#BDBDBD",
          borderBottomWidth: 1,
        },
        headerTitleAlign: "center",
      }}
    >
      {/* POSTS */}
      <MainTab.Screen
        name="Posts"
        component={PostsScreen}
        options={{
          title: "Posts",
          headerRight: () => (
            <TouchableOpacity
              style={{ paddingRight: 16 }}
              onPress={() => console.log("logout")}
            >
             
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={[
                styles.icon,
                { backgroundColor: focused ? "#FF6C00" : "#fff" },
              ]}
            >
              <Feather name="grid" size={size} color={color} />
            </View>
          ),
        }}
      />

      {/* CREATE POST */}
      <MainTab.Screen
        name="CreatePosts"
        component={CreatePostsScreen}
        options={{
          title: "Create a post",
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={[
                styles.icon,
                { backgroundColor: focused ? "#FF6C00" : "#fff" },
              ]}
            >
              <Feather name="plus" size={size} color={color} />
            </View>
          ),
        }}
      />

      {/* PROFILE */}
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <View
              style={[
                styles.icon,
                { backgroundColor: focused ? "#FF6C00" : "#fff" },
              ]}
            >
              <Feather name="user" size={size} color={color} />
            </View>
          ),
        }}
      />
    </MainTab.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 40,
    borderRadius: 20,
  },
});