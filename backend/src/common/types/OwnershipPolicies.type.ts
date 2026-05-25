import type { Includeable } from "sequelize";

type OwnershipPolicyBase = {
  param?: string;
  include?: Includeable[];
};

type OwnershipByField = OwnershipPolicyBase & {
  ownerField: string;
  ownerPath?: never;
};

type OwnerShipByPath = OwnershipPolicyBase & {
  ownerPath: string;
  ownerField?: never;
};

export type OwnershipPolicy = OwnershipByField | OwnerShipByPath;
export type OwnershipPolicies = Record<string, OwnershipPolicy>;
