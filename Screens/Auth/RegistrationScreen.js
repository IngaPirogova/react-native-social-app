import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { useDispatch } from "react-redux";
import { authSignUpUser } from "../../redux/auth/authOperations";
import Toast from "react-native-toast-message";

export default function RegistrationScreen({ navigation }) {
  const [state, setState] = useState({
    nickName: "",
    userEmail: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (loading) return;

    Keyboard.dismiss();

    // ✅ базовая валидация
    if (!state.userEmail.includes("@")) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Введите корректный email",
      });
      return;
    }

    if (state.password.length < 6) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Минимум 6 символов",
      });
      return;
    }

    if (!state.nickName) {
      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: "Введите ник",
      });
      return;
    }

    setLoading(true);

    try {
      await dispatch(authSignUpUser(state));

      Toast.show({
        type: "success",
        text1: "Аккаунт создан 🎉",
      });

    
    } catch (error) {
      console.log("SIGNUP ERROR:", error?.code);

      let message = "Ошибка регистрации";

      if (error?.code === "auth/email-already-in-use") {
        message = "Email уже используется";
      }

      if (error?.code === "auth/invalid-email") {
        message = "Некорректный email";
      }

      if (error?.code === "auth/weak-password") {
        message = "Пароль слишком слабый";
      }

      Toast.show({
        type: "error",
        text1: "Ошибка",
        text2: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Регистрация</Text>

          <TextInput
            placeholder="Nickname"
            style={styles.input}
            value={state.nickName}
            onChangeText={(v) =>
              setState((p) => ({ ...p, nickName: v }))
            }
          />

          <TextInput
            placeholder="Email"
            style={styles.input}
            value={state.userEmail}
            onChangeText={(v) =>
              setState((p) => ({ ...p, userEmail: v }))
            }
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={state.password}
            onChangeText={(v) =>
              setState((p) => ({ ...p, password: v }))
            }
          />

          <TouchableOpacity
            style={[
              styles.btn,
              { opacity: loading ? 0.6 : 1 },
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={{ color: "#fff" }}>
              {loading ? "Загрузка..." : "Зарегистрироваться"}
            </Text>
          </TouchableOpacity>

          {/* КНОПКА НАЗАД */}
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ marginTop: 20, textAlign: "center" }}>
              Уже есть аккаунт? Войти
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  btn: {
    backgroundColor: "#FF6C00",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
  },
});