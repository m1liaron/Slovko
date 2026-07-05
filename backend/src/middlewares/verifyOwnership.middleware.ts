import { StatusCodes } from "http-status-codes";

import type {
  AuthRequest,
  AuthRequestHandler,
} from "@/libs/types/auth-request.type.js";
import { HttpError, ownershipPolicies } from "@/libs/constants";

type OwnerId = string | number | null | undefined;

type VerifyOwnershipOptions<TResource extends Record<string, unknown>> = {
  findResource?: (id: string, req: AuthRequest) => Promise<TResource | undefined>;
  param?: string;
  ownerField?: string;
  isSelf?: boolean;
  ownerPath?: string;
  getOwnerId?: (resource: TResource, req: AuthRequest) => OwnerId | Promise<OwnerId>;
};

const getValueByPath = (value: unknown, path: string) =>
  path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, value);

const verifyOwnershipMiddleware =
  <TResource extends Record<string, unknown>>({
    findResource,
    param = "id",
    ownerField = "userId",
    ownerPath,
    isSelf = false,
    getOwnerId,
  }: VerifyOwnershipOptions<TResource>): AuthRequestHandler =>
    async (req, res, next) => {
      try {
        const resourceId = req.params[param];
        const userId = req.user.id;

        if (isSelf) {
          if (String(resourceId) !== String(userId)) {
            throw HttpError.forbidden("Forbidden. You are not owner");
          }
          next();
          return;
        }

        if (!findResource) {
          throw new Error(
            `Ownership policy is missing "findResource" for a non-self resource`,
          );
        }

        const resource = await findResource(resourceId, req);
        if (!resource) {
          throw HttpError.notFound(`Resource not found`);
        }

        const typedResource = resource as Record<string, unknown>

        const ownerId = getOwnerId
          ? await getOwnerId(resource, req)
          : ownerPath
            ? getValueByPath(resource, ownerPath)
            : resource[ownerField];

        if (!ownerId) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Ownership is not configured correctly for this resource",
          });
          return;
        }

        if (String(ownerId) !== String(userId)) {
          throw HttpError.forbidden("You're not owner of this resource");
        }

        next();
      } catch (error) {
        next(error);
      }
    };

const verifyOwnership = (
  resource: keyof typeof ownershipPolicies,
  options: Partial<VerifyOwnershipOptions<Record<string, unknown>>> = {},
) => {
  return verifyOwnershipMiddleware({
    ...ownershipPolicies[resource],
    ...options,
  } as VerifyOwnershipOptions<Record<string, unknown>>) ;
};

export { verifyOwnership };
