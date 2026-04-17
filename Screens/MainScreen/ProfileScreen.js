import React, { useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
  Image,
  Text,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations";

import { auth } from "../../firebase/config";
import { updateProfile } from "firebase/auth";

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { nickName, avatar, userEmail } = useSelector(
    (state) => state.auth
  );

  const [localAvatar, setLocalAvatar] = useState(avatar);

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  // ВЫБОР ФОТО
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      setLocalAvatar(uri);

      const photoURL = await uploadToCloudinary(uri);

      await updateProfile(auth.currentUser, {
        photoURL,
      });

      console.log("Avatar updated:", photoURL);
    }
  };

  // CLOUDINARY
  const uploadToCloudinary = async (uri) => {
    const formData = new FormData();

    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "avatar.jpg",
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

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.imgBg}
        source={require("../../assets/images/bg.jpg")}
      >
        <View style={styles.content}>

          {/* LOGOUT */}
          <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
            <Feather name="log-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>

          {/* AVATAR */}
          <View style={styles.avatarWrapper}>
            <Image
              source={
                localAvatar
                  ? { uri: localAvatar }
                  : { uri: `https://ui-avatars.com/api/?name=${nickName}` }
              }
              style={styles.userFoto}
            />

            <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
              <Feather name="plus-circle" size={25} color="#FF6C00" />
            </TouchableOpacity>
          </View>

          {/* INFO */}
          <Text style={styles.name}>{nickName}</Text>
          <Text style={styles.email}>{userEmail}</Text>

        </View>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },

  imgBg: { flex: 1 },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarWrapper: {
    position: "relative",
  },

  userFoto: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#eee",
  },

  addPhotoBtn: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#fff",
    borderRadius: 20,
  },

  logoutBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },

  name: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },

  email: {
    color: "#d8d2d2",
    marginTop: 5,
  },
});