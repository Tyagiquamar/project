import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Poll, PollResults } from '../types';

interface PollState {
  currentPoll: Poll | null;
  results: PollResults | null;
  pastPolls: Poll[];
}

const initialState: PollState = {
  currentPoll: null,
  results: null,
  pastPolls: [],
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setCurrentPoll: (state, action: PayloadAction<Poll>) => {
      state.currentPoll = action.payload;
    },
    setPollResults: (state, action: PayloadAction<PollResults>) => {
      state.results = action.payload;
    },
    addPastPoll: (state, action: PayloadAction<Poll>) => {
      state.pastPolls.push(action.payload);
    },
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
      state.results = null;
    },
  },
});

export const { setCurrentPoll, setPollResults, addPastPoll, clearCurrentPoll } = pollSlice.actions;
export default pollSlice.reducer;