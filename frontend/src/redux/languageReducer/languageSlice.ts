import { createSlice } from '@reduxjs/toolkit';

import type { Language } from '@/common/enums/types/language.type';

import { getLanguages } from './languageThunk';

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
