import { AuthRequest } from "./auth-request.type";

type OwnershipPolicyBase = {
  param?: string;
  findResource?: (id: string, req: AuthRequest) => Promise<unknown>;
  getOwnerId?: (
    resource: Record<string, unknown>,
    req: AuthRequest,
  ) =>
    | string
    | number
    | null
    | undefined
    | Promise<string | number | null | undefined>;
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
