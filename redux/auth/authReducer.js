import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  nickName: null,
  stateChange: false,
  isAuth: false,
  userEmail: null,
  avatar: null,
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
      state.isAuth = payload.stateChange;
    },

    authSignOut: () => initialState,
  },
});