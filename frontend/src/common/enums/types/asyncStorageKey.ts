import type { AsyncStorageVariables } from '../app/asyncStorageVariables';

type AsyncStorageKey =
  (typeof AsyncStorageVariables)[keyof typeof AsyncStorageVariables];

export type { AsyncStorageKey };
