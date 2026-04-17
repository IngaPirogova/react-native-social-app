import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../../firebase/config";
import { authSlice } from "./authReducer";

const { updateUserProfile, authStateChange, authSignOut } =
  authSlice.actions;


export const authSignUpUser = (body) => async (dispatch) => {
  const { avatar, userEmail, nickName, password } = body;

  try {
    await createUserWithEmailAndPassword(auth, userEmail, password);

    const user = auth.currentUser;

    if (user) {
      await updateProfile(user, {
        displayName: nickName,
        photoURL: avatar,
      });

      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickName: user.displayName,
          userEmail: user.email,
          avatar: user.photoURL,
        })
      );
    }

    return { success: true };
  } catch (error) {
    console.log("SIGNUP ERROR:", error.code);
    return Promise.reject(error);
  }
};


export const authSignInUser = (body) => async (dispatch) => {
  const { userEmail, password } = body;

  try {
    await signInWithEmailAndPassword(auth, userEmail, password);

    const user = auth.currentUser;

    if (user) {
      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickName: user.displayName,
          userEmail: user.email,
          avatar: user.photoURL,
        })
      );
    }

    return { success: true };
  } catch (error) {
    console.log("LOGIN ERROR:", error.code);

    return Promise.reject({
      code: error.code,
      message: error.message,
    });
  }
};


export const authStateCahngeUser = () => (dispatch) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(
        updateUserProfile({
          userId: user.uid,
          nickName: user.displayName,
          userEmail: user.email,
          avatar: user.photoURL,
        })
      );
    } else {
      
      dispatch(authSignOut());
    }

   
    dispatch(authStateChange({ stateChange: true }));
  });
};


export const authSignOutUser = () => async (dispatch) => {
  try {
    await signOut(auth);

    
    dispatch(authSignOut());

  } catch (error) {
    console.log("LOGOUT ERROR:", error);
  }
};