import {
  AuthInitialState,
  LoginCredentials,
  SignupCredentials,
} from "../../utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

//importing auth api calls
import apiCalls from "../../utils/apiCalls";
import { RootState } from "../store";

const initialState: AuthInitialState = {
  user: null,
  loginError: null,
  userPermissionToBeEdited: null,
  hasToVerify: false,
};

export const LoginUser = createAsyncThunk(
  "auth/login",
  async (cred: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiCalls.loginApiCall(cred);

      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const SignupUser = createAsyncThunk(
  "auth/signup",
  async (cred: SignupCredentials, { rejectWithValue, getState }) => {
    const token = (getState() as RootState).auth.user.token;
    try {
      const response = await apiCalls.signupApiCall(cred, token);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const authSlice: any = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserToBeEdited: (state, action) => {
      state.userPermissionToBeEdited = action.payload;
      console.log(state.userPermissionToBeEdited);
    },
    removeUserToBeEdited: (state) => {
      state.userPermissionToBeEdited = null;
    },
    logout: (state) => {
      state.user = null;
    },
    setUserHasToVerify: (state) => {
      state.hasToVerify = true;
    },
    removeHasToVerify: (state) => {
      state.hasToVerify = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        console.log(action.payload);
        console.log(state.user);
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loginError = action.payload;
      });
  },
});

export const {
  setUserToBeEdited,
  removeUserToBeEdited,
  logout,
  setUserHasToVerify,
  removeHasToVerify,
} = authSlice.actions;

export default authSlice.reducer;
