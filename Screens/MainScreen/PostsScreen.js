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
    Alert.alert("Удаление поста", "Удалить этот пост?", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Удалить",
        style: "destructive",
        onPress: () => deletePost(postId),
      },
    ]);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 20 }}>

        {/* IMAGE */}
        <View style={styles.photoWrapper}>
          <Image source={{ uri: item.photo }} style={styles.photo} />

          {/* DELETE BUTTON */}
          {item.userId === userId && (
            <>
              {/* EDIT */}
              <TouchableOpacity
                onPress={() => navigation.navigate("EditPost", { post: item })}
                style={[styles.deleteBtn, { right: 50 }]}
              >
                <Feather name="edit-2" size={18} color="#fff" />
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity
                onPress={() => confirmDelete(item.postId)}
                style={styles.deleteBtn}
              >
                <Feather name="trash-2" size={18} color="#fff" />
              </TouchableOpacity>
            </>
          )     }
        </View>

        {/* TITLE */}
        <Text style={styles.name}>Название: {item.name}</Text>

        {/* ACTIONS */}
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
  },

  photo: {
    width: "100%",
    height: "100%",
  },

  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
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