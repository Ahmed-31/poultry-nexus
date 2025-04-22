import {createSlice} from '@reduxjs/toolkit';

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        current: localStorage.getItem('lang') || 'en',
    },
    reducers: {
        setLanguage: (state, action) => {
            state.current = action.payload;
        },
    },
});

export const {setLanguage} = languageSlice.actions;
export default languageSlice.reducer;
