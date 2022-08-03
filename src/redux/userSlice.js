import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: "",
  projects: [],
  events: [],
  selectedEvent: "",
  selectedProject: "",
  clientDetails: "",
};
export const userSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
    addToken: (state, action) => {
      state.token = action.payload;
    },
    addProjects: (state, action) => {
      state.projects = action.payload;
    },
    addEvents: (state, action) => {
      state.events = action.payload;
    },
    selectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    selectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    addClientDetails: (state, action) => {
      state.clientDetails = action.payload;
    },
  },
});
export const {
  addUser,
  addToken,
  addProjects,
  addEvents,
  selectedProject,
  selectedEvent,
  addClientDetails,
} = userSlice.actions;
export default userSlice.reducer;
