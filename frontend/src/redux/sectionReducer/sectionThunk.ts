import { createAuthorizedInstance } from '@/utils';
import { createAppAsyncThunk } from '../services/createAppAsyncThunk';
import { ISection } from '@/common/enums/types/section.type';

const basicRoute = '/sections';

export const getSections = createAppAsyncThunk<ISection[], void>(
  'section/get-sections',
  async () => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.get(basicRoute);
    return response.data;
  },
);

export const addSection = createAppAsyncThunk(
  'section/add-section',
  async ({
    title,
    languageId,
  }: {
    title?: string;
    languageId?: null | string;
  }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.post(basicRoute, {
      title,
      languageId,
    });
    return response.data;
  },
);

export const removeSection = createAppAsyncThunk(
  'section/remove',
  async (sectionId: string) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.delete(`${basicRoute}/${sectionId}`);
    return response.data;
  },
);

export const updateSection = createAppAsyncThunk(
  'section/update',
  async ({ title, id }: { title: string; id: string }) => {
    const axiosInstance = await createAuthorizedInstance();
    const response = await axiosInstance.patch(`${basicRoute}/${id}`, {
      title,
    });
    return response.data;
  },
);
