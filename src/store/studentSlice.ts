import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../types';

interface StudentState {
  currentStudent: Student | null;
}

const initialState: StudentState = {
  currentStudent: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent: (state, action: PayloadAction<Student>) => {
      state.currentStudent = action.payload;
    },
    clearStudent: (state) => {
      state.currentStudent = null;
    },
  },
});

export const { setStudent, clearStudent } = studentSlice.actions;
export default studentSlice.reducer;