import type { ICard, ISection } from '@/common/enums/types/types';

import { createSlice } from '@reduxjs/toolkit';
import { DataStatus, type IDataStatus } from '../../common/enums/app/app';
import type { RootState } from '../store';
import {
  addSection,
  getSections,
  removeSection,
  updateSection,
} from './sectionThunk';

interface InitialState {
  sections: ISection[];
  status: IDataStatus;
  error: undefined | null | string;
  activeSectionId: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  sections: [],
  activeSectionId: '',
  status: DataStatus.IDLE,
  error: null,
  isLoading: false,
};

const sectionSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSections.fulfilled, (state, action) => {
        state.sections = action.payload;
      })
      .addCase(addSection.fulfilled, (state, action) => {
        state.sections = [...state.sections, action.payload];
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const updatedSection = action.payload;
        const index = state.sections.findIndex(
          (section) => section.id === updatedSection.id,
        );
        if (index !== -1) {
          state.sections[index] = updatedSection;
          state.sections = updatedSection;
          state.sections = [...state.sections];
        }
      })
      .addCase(removeSection.fulfilled, (state, action) => {
        state.sections = [...state.sections].filter(
          (section) => section.id !== action.payload.id,
        );
      });
  },
});

export const selectSections = (state: RootState) => state.sections.sections;
export const sectionReducers = sectionSlice.reducer;

export {
  getSections,
  addSection,
  updateSection,
  removeSection,
} from './sectionThunk';
