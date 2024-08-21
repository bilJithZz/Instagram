import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('https://api.example.com/data');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data); 
    }
  }
);

// Initial state
const initialState = {
  data: [], 
  status: 'idle', 
  error: null, 
};

// Slice
const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed'; 
        state.error = action.payload || 'Something went wrong'; 
      });
  },
});


export default dataSlice.reducer;
