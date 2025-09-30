import { createSlice } from '@reduxjs/toolkit';
import { getLanguages } from './languageThunk';
import { Language } from '@/common/enums/types/language.type';

interface LanguagesState {
  languages: Language[];
}

const initialState: LanguagesState = {
  languages: [],
};

export const languageSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLanguages.fulfilled, (state, action) => {
      state.languages = action.payload;
    });
  },
});

export const languageReducers = languageSlice.reducer;
