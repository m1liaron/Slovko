import type { Includeable } from "sequelize";

type OwnershipPolicyBase = {
  param?: string;
  include?: Includeable[];
};

type OwnershipByField = OwnershipPolicyBase & {
  ownerField: string;
  ownerPath?: never;
  isSelf?: boolean;
};

type OwnerShipByPath = OwnershipPolicyBase & {
  ownerPath: string;
  ownerField?: never;
  isSelf?: boolean;
};

export type OwnershipPolicy = OwnershipByField | OwnerShipByPath;
export type OwnershipPolicies = Record<string, OwnershipPolicy>;
