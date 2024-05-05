// import apiCalls from "../../utils/apiCalls";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FileInitialState } from "../../utils/types";
import fileApiCalls from "../../services/fileApiCalls";

const initialState: FileInitialState = {
  files: null,
};

export const GetAllFiles = createAsyncThunk(
  "files/get-all-files",
  async (token: string) => {
    const response = await fileApiCalls.getAllFilesCall(token);

    return response.data;
  }
);

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {},
  extraReducers: (buidlers) => {
    buidlers.addCase(GetAllFiles.fulfilled, (state, action) => {
      state.files = action.payload;
    });
  },
});

export default fileSlice.reducer;
