import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchProjects } from "@/api/projects";

export const getProjects = createAsyncThunk(
  "projects/getProjects",
  async (type) => {
    return await fetchProjects(type);
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    projects: [],
    filteredProjects: [],
    filters: {},
    loading: false,
    error: null,
  },
  reducers: {
    setFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;

      let filtered = state.projects;
      Object.entries(state.filters).forEach(([key, val]) => {
        if (val) {
          filtered = filtered.filter(
            (project) =>
              project[key] &&
              project[key].toString().toLowerCase().includes(val.toLowerCase())
          );
        }
      });
      state.filteredProjects = filtered;
    },
    clearFilters(state) {
      state.filters = {};
      state.filteredProjects = state.projects;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.filteredProjects = action.payload;
        state.loading = false;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilter, clearFilters } = projectsSlice.actions;

export default projectsSlice.reducer;
