import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { ICard, ISection } from '@/common/enums/types/types';

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
  activeSection: ISection | null;
  selectedLanguage: string;
  status: IDataStatus;
  error: undefined | null | string;
  isLoading: boolean;
}

const initialState: InitialState = {
  sections: [],
  activeSection: null,
  selectedLanguage: '',
  status: DataStatus.IDLE,
  error: null,
  isLoading: false,
};

const sectionSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addStateSection: (state, action) => {
      const newSection = {
        id: uuidv4(),
        title: action.payload.title,
      };
      state.sections = [...state.sections, newSection];
      state.activeSection = newSection;
    },
    setSelectedLanguage: (state, action) => {
      state.selectedLanguage = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSections.fulfilled, (state, action) => {
        if (!state.activeSection) {
          state.activeSection = action.payload[0];
        }
        if (Array.isArray(action.payload)) {
          state.sections = action.payload;
        }
      })
      .addCase(addSection.fulfilled, (state, action: { payload: ISection }) => {
        state.sections = [...state.sections, action.payload];
        state.activeSection = action.payload;
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
export const { addStateSection, setActiveSection, setSelectedLanguage } =
  sectionSlice.actions;
export const sectionReducers = sectionSlice.reducer;

export {
  getSections,
  addSection,
  updateSection,
  removeSection,
} from './sectionThunk';
