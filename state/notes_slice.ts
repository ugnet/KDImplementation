import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Note {
  id: number;
  title: string;
  body: string;
  date: string;
  locked: boolean;
}

export interface Notes extends Array<Note> {}

const initialState: Notes = [];

const notesSlice = createSlice({
  name: "notesSlice",
  initialState,
  reducers: {
    addNote(state: any[], action: PayloadAction<Note>) {
      state.push(action.payload);
    },
    editNote(state: any[], action: PayloadAction<Note>) {
      const note = state.find((note) => note.id === action.payload.id);
      note.body = action.payload.body;
      note.title = action.payload.title;
      note.date = action.payload.date;
      note.locked = action.payload.locked;
    },
  },
});

export const { addNote, editNote } = notesSlice.actions;
export default notesSlice.reducer;
