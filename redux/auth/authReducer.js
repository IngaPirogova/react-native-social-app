import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  nickName: null,
  userEmail: null,
  avatar: null,
  isAuth: false,
  stateChange: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateUserProfile: (state, { payload }) => {
      state.userId = payload.userId;
      state.nickName = payload.nickName;
      state.userEmail = payload.userEmail;
      state.avatar = payload.avatar;
      state.isAuth = true;
    },

    authStateChange: (state, { payload }) => {
      state.stateChange = payload.stateChange; 
    },

    authSignOut: (state) => {
      state.userId = null;
      state.nickName = null;
      state.userEmail = null;
      state.avatar = null;
      state.isAuth = false;
    },
  },
});