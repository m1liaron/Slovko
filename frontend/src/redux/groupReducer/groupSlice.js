import { createSlice } from '@reduxjs/toolkit';
import {
  getAllGroups,
  getGroup,
  addGroup,
  removeGroup,
  updateGroup,
} from './groupThunk';
import { DataStatus } from '../../common/enums/app/DataStatus';

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    group: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllGroups.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getAllGroups.fulfilled, (state, action) => {
        state.status = 'success';
        state.groups = action.payload;
      })
      .addCase(getAllGroups.rejected, (state) => {
        state.status = 'rejected';
      })

      .addCase(addGroup.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.status = 'success';
        state.groups.push(action.payload);
      })
      .addCase(addGroup.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(getGroup.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getGroup.fulfilled, (state, action) => {
        state.status = 'success';
        state.group = action.payload;
      })
      .addCase(getGroup.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(removeGroup.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(removeGroup.fulfilled, (state, action) => {
        state.status = 'success';
        state.groups = state.groups.filter(
          (group) => group.id !== action.payload.id
        );
      })
      .addCase(removeGroup.rejected, (state) => {
        state.status = 'rejected';
      })
      // update
      .addCase(updateGroup.pending, (state) => {
        state.status = DataStatus.PENDING;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.status = DataStatus.SUCCESS;
        state.error = null;
        const updatedGroup = action.payload;
        const index = state.groups.findIndex(
          (group) => group.id === updatedGroup.id
        );
        if (index !== -1) {
          state.groups[index] = updatedGroup;
          state.group = updatedGroup;
          state.groups = [...state.groups];
        }
      })
      .addCase(updateGroup.rejected, (state) => {
        state.status = DataStatus.ERROR;
      });
  },
});

export const selectGroup = (state) => state.groups.groups;
export {
  getAllGroups,
  getGroup,
  addGroup,
  removeGroup,
  updateGroup,
} from './groupThunk';
export const groupReducers = groupSlice.reducer;
