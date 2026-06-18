import { StatusCodes } from "http-status-codes";
import type { Includeable, Model, ModelStatic } from "sequelize";

import { HttpError } from "../common/constants/HttpError.js";
import { ownershipPolicies } from "../common/enums/constants/ownershipPolicies.js";
import type {
  AuthRequest,
  AuthRequestHandler,
} from "../common/types/AuthRequest.type.js";

type VerifyOwnershipOptions<TModel extends Model> = {
  Model: ModelStatic<TModel>;
  param?: string;
  ownerField?: string;
  isSelf?: boolean;
  ownerPath?: string;
  include?: Includeable[];
  getOwnerId?: (
    resource: TModel,
    req: AuthRequest,
  ) =>
    | string
    | number
    | null
    | undefined
    | Promise<string | number | null | undefined>;
};

type VerifyOwnershipFactoryOptions<TModel extends Model> = {
  Model: ModelStatic<TModel>;
  param?: string;
};

const getValueByPath = (value: unknown, path: string) =>
  path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, value);

const verifyOwnershipMiddleware =
  <TModel extends Model>({
    Model,
    param = "id",
    ownerField = "userId",
    ownerPath,
    isSelf = false,
    include = [],
    getOwnerId,
  }: VerifyOwnershipOptions<TModel>): AuthRequestHandler<TModel> =>
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

      const resource = await Model.findByPk(resourceId, { include });

      if (!resource) {
        throw HttpError.notFound(`Param: ${param} not found`);
      }

      const ownerId = getOwnerId
        ? await getOwnerId(resource, req)
        : ownerPath
          ? getValueByPath(resource.get({ plain: true }), ownerPath)
          : resource.get(ownerField as string);

      if (!ownerId) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Ownership is not configured correctly for this resource",
        });
        return;
      }

      if (String(ownerId) !== String(userId)) {
        throw HttpError.forbidden(
          "Ownership is not configured correctly for this resource",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };

const verifyOwnership = <TModel extends Model>(
  resource: keyof typeof ownershipPolicies,
  options: VerifyOwnershipFactoryOptions<TModel>,
) => {
  return verifyOwnershipMiddleware<TModel>({
    ...ownershipPolicies[resource],
    ...options,
  });
};

export { verifyOwnership };
