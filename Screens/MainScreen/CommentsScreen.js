import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  SafeAreaView,
  FlatList,
  Keyboard,
  Platform,  
} from "react-native";

import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { AntDesign } from "@expo/vector-icons";
import { addDoc, collection, getDocs, increment, doc, updateDoc } from "firebase/firestore";

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  const { nickName } = useSelector((state) => state.auth);

  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState([]);

  const fetchCommentsByPostId = async () => {
    try {
      const commentsCollection = collection(db, `posts/${postId}/comments`);
      const querySnapshot = await getDocs(commentsCollection);

      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAllComments(commentsData);
    } catch (error) {
      console.log("Ошибка:", error.message);
    }
  };

  useEffect(() => {
    fetchCommentsByPostId();
  }, [postId]);

  const uploadComments = async () => {
    if (!newComment.trim()) return;

    try {
      const commentsCollection = collection(db, `posts/${postId}/comments`);

      await addDoc(commentsCollection, {
        comments: newComment,
        nickName,
        createdAt: Date.now(),
      });

    // обновляем пост
      const postRef = doc(db, "posts", postId);

      await updateDoc(postRef, {
        commentsCount: increment(1),
      });

      setNewComment("");
      fetchCommentsByPostId();
    } catch (error) {
      console.log("Ошибка добавления:", error.message);
    }
  };  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={allComments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>
                    {item.nickName}
                  </Text>
                  <Text>{item.comments}</Text>
                </View>
              )}
            />
          </SafeAreaView>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Комментировать..."
              value={newComment}
              onChangeText={setNewComment}
            />

            <TouchableOpacity
              onPress={uploadComments}
              style={styles.iconWrapper}
            >
              <AntDesign name="up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 50,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",

  },

  inputWrapper: {
    position: "relative",
    height: 50,
    width: "100%",
    paddingTop: 16,
    paddingBottom: 16,
  },
  input: {
    height: 50,
    borderRadius: 100,
    padding: 16,
    backgroundColor: "#F6F6F6",
    color: "#BDBDBD",
  },
  iconWrapper: {
    position: "absolute",
    top: 24,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: "#FF6C00",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },

});

export default CommentsScreen;
















//  import { View, Text, StyleSheet } from "react-native"

// const CommentsScreen = () => {
//     return (
//         <View style={styles.container}>
//             <Text>CommentsScreen</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//  container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     },
// });

// export default CommentsScreen;