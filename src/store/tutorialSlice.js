import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTutorialSteps } from '../services/tutorialService';
import { getUserProgress, updateUserProgress } from '../services/userProgressService';

export const fetchSteps = createAsyncThunk(
  'tutorial/fetchSteps',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTutorialSteps();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProgress = createAsyncThunk(
  'tutorial/fetchUserProgress',
  async (userId, { rejectWithValue }) => {
    try {
      return await getUserProgress(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  steps: [],
  currentStepIndex: 0,
  completedSteps: [],
  loading: false,
  error: null,
  lastAccessed: null
};

export const tutorialSlice = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStepIndex = action.payload;
    },
    markStepComplete: (state, action) => {
      const stepId = action.payload;
      if (!state.completedSteps.includes(stepId)) {
        state.completedSteps.push(stepId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSteps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSteps.fulfilled, (state, action) => {
        state.steps = action.payload;
        state.loading = false;
      })
      .addCase(fetchSteps.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export const { setCurrentStep, markStepComplete } = tutorialSlice.actions;
export default tutorialSlice.reducer;