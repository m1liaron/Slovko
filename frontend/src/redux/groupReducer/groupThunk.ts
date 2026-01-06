import { AsyncStorageVariables } from '@/common/enums/app/asyncStorageVariables';
import type { IGroup } from '@/common/enums/types/group.type';
import { getStorageItem } from '@/utils/storage';

import { createAuthorizedInstance } from '../../utils/createAuthorizedInstance';
import { createAppAsyncThunk } from '../services/createAppAsyncThunk';

export const getAllGroups = createAppAsyncThunk(
  'group/getAll',
  async (sectionId: string) => {
    const axiosInstance = await createAuthorizedInstance();
    if (sectionId) {
      const response = await axiosInstance.get(`/groups/${sectionId}`);
      return response.data;
    }
  },
);

export const addGroup = createAppAsyncThunk(
  'group/add',
  async (data: { id: string; title: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.post('/groups', data);
    return response.data;
  },
);

export const getGroup = createAppAsyncThunk(
  'group/get',
  async ({ groupId }: { groupId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(`/groups/${groupId}`);
    return response.data;
  },
);

export const getGroupStorage = createAppAsyncThunk(
  'group/get-storage',
  async ({ groupId }: { groupId: string }) => {
    const storage = await getStorageItem(AsyncStorageVariables.PERSIST_ROOT);
    if (!storage) {
      return null;
    }
    const parsedGroups = JSON.parse(JSON.parse(storage).groups).groups;

    const currentGroup = parsedGroups.find(
      (group: IGroup) => group.id === groupId,
    );
    return currentGroup;
  },
);

export const removeGroup = createAppAsyncThunk(
  'group/remove',
  async ({ groupId, sectionId }: { groupId: string; sectionId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.delete(
      `/groups/${groupId}/${sectionId}`,
    );
    return response.data;
  },
);

export const updateGroup = createAppAsyncThunk(
  'group/update',
  async (data: IGroup) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.patch(`/groups/${data.id}`, data);
    return response.data;
  },
);

export const moveGroupToAnotherSection = createAppAsyncThunk(
  'group/moveToSection',
  async ({ sectionId, groupId }: { sectionId: string; groupId: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.put(`/groups/${groupId}`, {
      sectionId,
    });
    return response.data;
  },
);
