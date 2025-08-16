// /store/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: true,
  error: null,
};

export const checkUserSession = createAsyncThunk(
  'auth/checkUserSession',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        return rejectWithValue('No active session');
      }
      const data = await res.json();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
    // **THE CHANGE: Add a new reducer to set the user synchronously**
    setUserOnLogin: (state, action) => {
        state.user = action.payload;
        state.loading = false; // We know the user is loaded now
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUserSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(checkUserSession.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setUserOnLogin } = authSlice.actions; // **Export the new action**
export default authSlice.reducer;
