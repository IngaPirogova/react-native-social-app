import React, { useState } from "react";
import {
    StyleSheet,
    ImageBackground,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import { authSignInUser } from "../../redux/auth/authOperations";
import Toast from "react-native-toast-message";


const initialState = {
    userEmail: "",
    password: "",
};

export default function LoginScreen({ navigation }) {
    const [state, setState] = useState(initialState);
    const dispatch = useDispatch();

    const handleSubmit = async () => {
        Keyboard.dismiss();

        try {
            await dispatch(authSignInUser(state));

            Toast.show({
                type: "success",
                text1: "Welcome 👋",
            });

           
        } catch (error) {
            console.log("LOGIN ERROR:", error);

            let message = "Login error";

            if (error.code === "auth/wrong-password") {
                message = "Invalid password";
            }

            if (error.code === "auth/user-not-found") {
                message = "User not found";
            }

            Toast.show({
                type: "error",
                text1: "Error",
                text2: message,
            });
        }
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.imgBg}
                    source={require("../../assets/images/bg.jpg")}
                >
                    <KeyboardAvoidingView
                        style={styles.wrapper}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <View style={styles.loginWrapper}>

                            <Text style={styles.title}>Войти</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={state.userEmail}
                                onChangeText={(v) =>
                                    setState((p) => ({ ...p, userEmail: v }))
                                }
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                secureTextEntry
                                value={state.password}
                                onChangeText={(v) =>
                                    setState((p) => ({ ...p, password: v }))
                                }
                            />

                            <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                                <Text style={{ color: "#fff" }}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
                                <Text style={{ marginTop: 20 }}>Registration</Text>
                            </TouchableOpacity>

                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imgBg: { flex: 1 },
    wrapper: { flex: 1, justifyContent: "flex-end" },
    loginWrapper: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: { fontSize: 28, textAlign: "center", marginBottom: 20 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 15,
        padding: 10,
        borderRadius: 8,
    },
    btn: {
        backgroundColor: "#FF6C00",
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
    },
});