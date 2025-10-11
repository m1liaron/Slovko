import { Language } from './language.type';

type ISection = {
  id: string;
  title: string;
  userId?: string;
  Language?: Language;
};

export type { ISection };
