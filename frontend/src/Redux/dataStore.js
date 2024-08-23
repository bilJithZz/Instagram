
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './dataSlice';
import postsReducer from './postSlice'

export const store = configureStore({
    reducer: {
        auth:authSlice,
        posts: postsReducer,
    },
});


export default store