import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";

import { useSelector } from "react-redux";
import { Octicons, FontAwesome5, Feather } from "@expo/vector-icons";

import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase/config";

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        postId: doc.id,
      }));

      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, "posts", postId));
    } catch (e) {
      console.log("DELETE ERROR:", e);
    }
  };

  const confirmDelete = (postId) => {
    Alert.alert("Delete post", "Delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deletePost(postId),
      },
    ]);
  };

  const renderItem = ({ item }) => {
   
    const isOwner =
      userId && item.userId
        ? String(userId) === String(item.userId)
        : false;

    return (
      <View style={{ marginBottom: 20 }}>
      
        <View style={styles.photoWrapper}>
          <Image source={{ uri: item.photo }} style={styles.photo} />

      
          {isOwner && (
            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("EditPost", { post: item })
                }
                style={styles.iconBtn}
              >
                <Feather name="edit-2" size={18} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => confirmDelete(item.postId)}
                style={styles.iconBtn}
              >
                <Feather name="trash-2" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

       
        <Text style={styles.name}>Name: {item.name}</Text>

      
        <View style={styles.wrapperDescr}>
          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() =>
              navigation.navigate("Comments", { postId: item.postId })
            }
          >
            <FontAwesome5 name="comment" size={18} color="#BDBDBD" />
            <Text style={{ marginLeft: 6 }}>
              {item.commentsCount ?? 0} comments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputWrapper}
            onPress={() =>
              navigation.navigate("Map", {
                location: item.location,
              })
            }
          >
            <Octicons name="location" size={18} color="#BDBDBD" />
            <Text style={{ marginLeft: 6 }}>
              {typeof item.location === "string"
                ? item.location
                : item.location?.latitude
                  ? `${item.location.latitude}, ${item.location.longitude}`
                  : "N/A"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.postId}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },

  photoWrapper: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#eee",
    position: "relative",
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  actions: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 10,
  },

  iconBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
  },

  name: {
    marginTop: 8,
    fontWeight: "600",
  },

  wrapperDescr: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
});