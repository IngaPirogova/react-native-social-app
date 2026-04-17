import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Location from "expo-location";

import Toast from "react-native-toast-message";

import { db } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";

const CreatePostsScreen = ({ navigation }) => {
  const cameraRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  const { userId, nickName } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      await requestPermission();
      await MediaLibrary.requestPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();
    })();
  }, []);

  // PHOTO + LOCATION
  const takePhoto = async () => {
    try {
      const data = await cameraRef.current.takePictureAsync();
      const loc = await Location.getCurrentPositionAsync({});

      setPhoto(data.uri);
      setCoords(loc.coords); 

      console.log("PHOTO:", data.uri);
    } catch (e) {
      console.log(e);
    }
  };

  // CLOUDINARY
  const uploadPhotoToServer = async () => {
    const formData = new FormData();

    formData.append("file", {
      uri: photo,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    formData.append("upload_preset", "post_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dozcwyxcw/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  // POST
  const sendPhoto = async () => {
    try {
      if (!photo || !name) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Fill in all fields",
        });
        return;
      }

      setLoading(true);

      const photoURL = await uploadPhotoToServer();

      await addDoc(collection(db, "posts"), {
        photo: photoURL,
        name,
        location: coords
          ? `${coords.latitude}, ${coords.longitude}`
          : "",
        userId,
        nickName,
        createdAt: Date.now(),
      });

      Toast.show({
        type: "success",
        text1: "Ready🎉",
        text2: "Post successfully published",
      });

      setPhoto(null);
      setName("");
      setCoords(null);

      navigation.navigate("Home");
    } catch (e) {
      console.log(e);

      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to publish post",
      });
    } finally {
      setLoading(false);
    }
  };

  const isActive = photo && name;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 120, 
            }}
            keyboardShouldPersistTaps="handled"
          >

            {/* CAMERA */}
            <View style={styles.cameraBox}>
              <CameraView style={{ flex: 1 }} ref={cameraRef} />

              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={takePhoto}
              >
                <Text style={{ fontSize: 24 }}>＋</Text>
              </TouchableOpacity>
            </View>

            {/* LOCATION TEXT */}
            {coords && (
              <Text style={{ marginTop: 10, color: "#555" }}>
                📍 {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
              </Text>
            )}

            {/* PREVIEW */}
            {photo && (
              <Image
                source={{ uri: photo }}
                style={{ height: 200, marginTop: 10, borderRadius: 10 }}
              />
            )}

            <TextInput
              placeholder="Name..."
              value={name}
              onChangeText={setName}
              style={styles.input}
            />

            {/* BUTTON */}
            <View style={{ marginTop: 30, marginBottom: 40 }}>
              <TouchableOpacity
                disabled={!isActive || loading}
                onPress={sendPhoto}
                style={[
                  styles.button,
                  {
                    backgroundColor: isActive ? "#FF6C00" : "#E0E0E0",
                  },
                ]}
              >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff" }}>
                      Publish
                </Text>
              )}
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  cameraBox: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#eee",
  },

  cameraBtn: {
    position: "absolute",
    alignSelf: "center",
    bottom: 15,
    backgroundColor: "#FF6C00",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    marginTop: 20,
    padding: 10,
  },

  button: {
    marginTop: 30,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});