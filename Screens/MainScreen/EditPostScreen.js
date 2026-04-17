import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const EditPostScreen = ({ route, navigation }) => {
    const { post } = route.params;

    const [name, setName] = useState(post.name);

    const saveChanges = async () => {
        try {
            await updateDoc(doc(db, "posts", post.postId), {
                name,
            });

            navigation.goBack();
        } catch (e) {
            console.log("UPDATE ERROR:", e);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TouchableOpacity style={styles.btn} onPress={saveChanges}>
                <Text style={{ color: "#fff" }}>SafeAreaView</Text>
            </TouchableOpacity>
        </View>
    );
};

export default EditPostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },

    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 20,
    },

    btn: {
        backgroundColor: "#FF6C00",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
    },
});