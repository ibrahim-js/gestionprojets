import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchProjectById } from "@/api/projects";

export const getProject = createAsyncThunk(
  "project/getProject",
  async ({ type, id }) => {
    return await fetchProjectById(type, id);
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: null,
    loading: true,
  },
  reducers: {
    setProject(state, action) {
      state.project = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = false;
        state.project = action.payload;
      })
      .addCase(getProject.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setProject, setLoading } = projectSlice.actions;

export default projectSlice.reducer;
