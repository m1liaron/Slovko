import { PayloadAction } from '@reduxjs/toolkit';

type RejectedPayload = {
  message: string;
  status: number;
};

type RejectedAction = PayloadAction<RejectedPayload>;
export type { RejectedAction, RejectedPayload };
